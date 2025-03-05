use std::fs::File;

#[tauri::command(rename_all = "snake_case")]
pub fn get_csv_info(file_path: String) -> Result<Vec<String>, String> {
    let file = File::open(file_path).map_err(|e| format!("Failed to open CSV file: {}", e))?;
    let mut rdr = csv::Reader::from_reader(file);
    // let len = rdr.records().count();
    let headers: Vec<String> = rdr
        .headers()
        .map_err(|e| format!("Failed to read CSV headers: {}", e))?
        .iter()
        .map(|s| s.to_string())
        .collect();
    Ok(headers)
}
