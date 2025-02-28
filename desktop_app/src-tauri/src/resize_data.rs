use std::{collections::HashMap, thread, time::Duration};
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn resize_data(
    data: HashMap<String, Vec<f64>>,
) -> Result<HashMap<String, Vec<f64>>, String> {
    task::spawn_blocking(move || {
        println!("Resizing data");
        thread::sleep(Duration::from_millis(3000));
        Ok(data)
    })
    .await
    .unwrap_or(Err(String::from("Failed to start multi-threaded runner")))
    // Err(String::from("failed to start runner"))
}
