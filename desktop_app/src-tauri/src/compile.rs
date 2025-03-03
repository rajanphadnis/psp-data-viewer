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

// fn create_dataframes(data: HashMap<String, Vec<f64>>) -> Result<Vec<DataFrame>, String> {
//     // Group column names by their base name (without "_time" suffix)
//     let mut column_pairs: HashMap<String, (Option<String>, Option<String>)> = HashMap::new();

//     for column_name in data.keys() {
//         if column_name.ends_with("_time") {
//             let base_name = column_name.strip_suffix("_time").unwrap();
//             let entry = column_pairs
//                 .entry(base_name.to_string())
//                 .or_insert((None, None));
//             entry.1 = Some(column_name.clone());
//         } else {
//             let entry = column_pairs
//                 .entry(column_name.clone())
//                 .or_insert((None, None));
//             entry.0 = Some(column_name.clone());
//         }
//     }

//     // Create a DataFrame for each valid pair
//     let mut dataframes = Vec::new();
//     // let mut dataframes = HashMap::<String, LazyFrame>::new();
//     for (_, (value_col, time_col)) in column_pairs {
//         if let (Some(value_col), Some(time_col)) = (value_col, time_col) {
//             if let (Some(values), Some(times)) = (data.get(&value_col), data.get(&time_col)) {
//                 // For efficiency, create series directly from slices
//                 let channel_name = value_col.clone();
//                 let value_series = Series::new(value_col.into(), values.as_slice());
//                 let time_series = Series::new(time_col.into(), times.as_slice());
//                 println!("{}", channel_name);
//                 // Create DataFrame
//                 match DataFrame::new(vec![Column::from(value_series), Column::from(time_series)]) {
//                     Ok(df) => {
//                         // dataframes.insert(channel_name, df.lazy());
//                         dataframes.push(df)
//                     }
//                     Err(e) => {
//                         return Err(String::from(format!(
//                             "failed to create dataframe pair: {}",
//                             e
//                         )))
//                     }
//                 }
//             }
//         }
//     }

//     Ok(dataframes)
// }
