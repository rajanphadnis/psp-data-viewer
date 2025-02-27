use std::collections::HashMap;

use hdf5::File;
use ndarray::Array1;
use tauri_plugin_dialog::DialogExt;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn create_hdf5(
    app: tauri::AppHandle,
    export_data: HashMap<String, Vec<f64>>,
) -> Result<bool, String> {
    task::spawn_blocking(move || {
        let file_path_raw = app
            .dialog()
            .file()
            .add_filter("Dataviewer.Space Test File", &["hdf5"])
            .blocking_save_file();
        // Define the fully qualified path
        let file_path = match file_path_raw {
            Some(file) => file,
            None => return Err(String::from("Closed file picker dialog")),
        };

        let f_path = match file_path.into_path() {
            Ok(f) => f,
            Err(e) => return Err(format!("Failed to get path: {}", e)),
        };

        // Create or open the file
        let file = match File::create(f_path) {
            Ok(f) => f,
            Err(e) => return Err(format!("Failed to create file: {}", e)),
        };

        for (dataset_name, data) in export_data {
            println!("create channel: {}", dataset_name);
            println!("Data length: {}", data.len());
            let array = Array1::from_vec(data);
            println!("Array shape: {:?}", array.shape());

            // Create the dataset with the correct dimensions
            let dataset = match file
                .new_dataset::<f64>()
                .shape(array.shape())
                .create(dataset_name.as_str())
            {
                Ok(ds) => ds,
                Err(e) => return Err(format!("Failed to create dataset: {}", e)),
            };

            // Get slice data
            let slice_data = match array.as_slice() {
                Some(slice) => slice,
                None => return Err("Failed to convert array to slice".to_string()),
            };

            // Create the proper selection type (using the HDF5 crate's Selection types)
            match dataset.write(slice_data) {
                Ok(_) => {
                    println!("Successfully wrote data to HDF5");
                    // Ok(true)
                }
                Err(e) => return Err(format!("Failed to write data: {}", e)),
            };
        }
        Ok(true)
    })
    .await
    .unwrap_or(Err(String::from("Failed to start multi-threaded runner")))
}
