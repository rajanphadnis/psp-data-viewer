use std::path::Path;
use tdms::TDMSFile;

#[tauri::command(rename_all = "snake_case")]
pub fn get_all_channels(path_string: &str) -> Result<Vec<String>, Vec<String>> {
    let tdms_file = match TDMSFile::from_path(Path::new(&path_string)) {
        Ok(file) => file,
        Err(e) => {
            return Err(vec![String::from(format!(
                "Failed to open TDMS file: {}",
                e
            ))]);
        }
    };
    let mut total_channels: Vec<String> = Vec::new();
    let groups = &tdms_file.groups();
    for group in groups {
        let channels = tdms_file.channels(group);
        for channel in channels {
            let channel_path = channel.1.full_path.clone();
            total_channels.push(channel_path);
        }
    }
    return Ok(total_channels);
}
