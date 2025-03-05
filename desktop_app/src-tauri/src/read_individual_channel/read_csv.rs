use tokio::task;

use crate::gen_csv_df;

#[tauri::command(rename_all = "snake_case")]
pub async fn read_channel(
    file_path: String,
    channel_name: String,
) -> Result<(Vec<Option<f64>>, Vec<f64>), String> {
    let df = gen_csv_df(file_path).await.map_err(|e| e)?;
    let data_to_return = task::spawn_blocking(move || {
        let result: Result<(Vec<Option<f64>>, Vec<f64>), String> = (|| {
            let data = df
                .column(&channel_name)
                .map_err(|e| format!("failed to read '{}' from CSV file: {}", channel_name, e))?
                .f64()
                .map_err(|e| {
                    format!(
                        "failed to read channel '{}' from CSV into array: {}",
                        channel_name, e
                    )
                })?
                .into_iter()
                .collect();

            let time = df
                .column("time")
                .map_err(|e| format!("failed to read time column from CSV file: {}", e))?
                .f64()
                .map_err(|e| format!("failed to read time column from CSV into Vec<f64>: {}", e))?
                .into_no_null_iter()
                .collect();

            Ok((data, time))
        })();
        result
    })
    .await
    .map_err(|e| {
        format!(
            "Failed to start multi-threaded runner for tdms dataframe compilation: {}",
            e
        )
    })?
    .map_err(|e| e)?;
    Ok(data_to_return)
}
