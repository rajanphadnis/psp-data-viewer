use crate::{
    processing::{flatten::flatten, resize::calc_resize_datasets},
    save_dataframe, stack_duplicate_channels,
    types::DataFile,
};
use hdf5::File;
use std::time::SystemTime;
use tauri_plugin_dialog::DialogExt;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn compile(
    app: tauri::AppHandle,
    files: Vec<DataFile>,
    save_raw_data: bool,
) -> Result<(u64, (usize, usize)), String> {
    let now = SystemTime::now();
    let get_file_path = task::spawn_blocking(move || {
        File::create(
            app.dialog()
                .file()
                .add_filter("Dataviewer.Space Test File", &["hdf5"])
                .blocking_save_file()
                .ok_or(String::from("Closed file picker dialog"))?
                .into_path()
                .map_err(|e| format!("Failed to get path: {}", e))?,
        )
        .map_err(|e| format!("Failed to create file: {}", e))
    });

    let (channels_info, data) = flatten(files).await.map_err(|e| format!("{}", e))?;

    let compilation = task::spawn_blocking(move || {
        println!("Creating dataframes");
        let dataframes = stack_duplicate_channels(data).map_err(|e| e)?;
        calc_resize_datasets(dataframes, channels_info, save_raw_data).map_err(|e| e)
    });

    let file = get_file_path
        .await
        .map_err(|e| {
            format!(
                "Failed to start multi-threaded runner for file saving dialog: {}",
                e
            )
        })?
        .map_err(|e| e)?;
    let df_to_write = compilation
        .await
        .map_err(|e| {
            format!(
                "Failed to start multi-threaded runner for dataframe compilation: {}",
                e
            )
        })?
        .map_err(|e| e)?;

    let save_file = task::spawn_blocking(move || save_dataframe(df_to_write, file).map_err(|e| e))
        .await
        .map_err(|e| {
            format!(
                "Failed to start multi-threaded runner for file saving dialog: {}",
                e
            )
        })?
        .map_err(|e| e)?;
    match now.elapsed() {
        Ok(elapsed) => {
            println!("Processing time: {}", elapsed.as_secs());
            Ok((elapsed.as_secs(), save_file))
        }
        Err(e) => Err(format!("failed to stop performance timer: {}", e)),
    }
}
