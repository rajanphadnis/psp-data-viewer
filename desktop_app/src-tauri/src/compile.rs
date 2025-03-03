use crate::{
    processing::{flatten::flatten, resize::calc_resize_datasets},
    save_dataframe, stack_duplicate_channels,
    types::DataFile,
};
use hdf5::File;
use std::time::SystemTime;
use tauri::Emitter;
use tauri_plugin_dialog::DialogExt;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn compile(
    app: tauri::AppHandle,
    files: Vec<DataFile>,
    save_raw_data: bool,
) -> Result<(u64, (usize, usize)), String> {
    app.clone()
        .emit("event-log", "Starting compilation process")
        .unwrap();
    let now = SystemTime::now();
    let app_handle = app.clone();
    let get_file_path = task::spawn_blocking(move || {
        let f = File::create(
            app_handle
                .dialog()
                .file()
                .add_filter("Dataviewer.Space Test File", &["hdf5"])
                .blocking_save_file()
                .ok_or(String::from("Closed file picker dialog"))?
                .into_path()
                .map_err(|e| format!("Failed to get path: {}", e))?,
        )
        .map_err(|e| format!("Failed to create file: {}", e));
        app_handle
            .emit("event-log", "Created file save location")
            .unwrap();
        f
    });
    app.emit("event-log", "Reading channels").unwrap();
    let (channels_info, data) = flatten(files, app.clone())
        .await
        .map_err(|e| format!("{}", e))?;

    let app_handle_compile = app.clone();
    let compilation = task::spawn_blocking(move || {
        println!("Creating dataframes");
        app_handle_compile
            .emit("event-log", "stack::start")
            .unwrap();
        let dataframes =
            stack_duplicate_channels(app_handle_compile.clone(), data).map_err(|e| e)?;
        app_handle_compile
            .emit("event-log", "stack::complete")
            .unwrap();
        calc_resize_datasets(
            app_handle_compile.clone(),
            dataframes,
            channels_info,
            save_raw_data,
        )
        .map_err(|e| e)
    });

    app.emit("event-log", "Awaiting file save...").unwrap();
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

    app.emit("event-log", "Saving results to HDF5 file")
        .unwrap();
    let save_file = task::spawn_blocking(move || save_dataframe(df_to_write, file).map_err(|e| e))
        .await
        .map_err(|e| {
            format!(
                "Failed to start multi-threaded runner for file saving dialog: {}",
                e
            )
        })?
        .map_err(|e| e)?;
    app.emit("event-log", "Compilation complete").unwrap();
    match now.elapsed() {
        Ok(elapsed) => {
            println!("Processing time: {}", elapsed.as_secs());
            app.emit(
                "event-log",
                format!(
                    "Compiled {} data points in {}s",
                    save_file.0 * save_file.1,
                    elapsed.as_secs()
                ),
            )
            .unwrap();
            Ok((elapsed.as_secs(), save_file))
        }
        Err(e) => Err(format!("failed to stop performance timer: {}", e)),
    }
}
