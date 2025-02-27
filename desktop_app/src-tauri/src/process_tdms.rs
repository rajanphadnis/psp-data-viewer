use crate::read_data::read_data;
use std::path::Path;
use tdms::TDMSFile;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn process_channel_data(
    group_name: &str,
    channel_name: &str,
    file_path: &str,
) -> Result<Vec<f64>, String> {
    let group_name = group_name.to_string();
    let channel_name = channel_name.to_string();
    let file_path = file_path.to_string();
    // Spawn a new thread to do the processing
    task::spawn_blocking(move || {
        let result: Result<Vec<f64>, String> = (|| {
            // Open and read TDMS file
            let tdms_file = TDMSFile::from_path(Path::new(&file_path))
                .map_err(|e| format!("Failed to open TDMS file: {}", e))?;

            // Find channel
            let channels = tdms_file.channels(&group_name);
            let channel = channels
                .iter()
                .find(|chan| *chan.0 == channel_name)
                .ok_or_else(|| String::from(format!("Couldn't find channel: {}", channel_name)))?;

            // Process channel data
            read_data(&channel_name, channel.1, &tdms_file)
        })();
        result
    })
    .await
    .unwrap_or(Err(String::from("Failed to start multi-threaded runner")))
}
