#[tauri::command(rename_all = "snake_case")]
pub fn create_timeframe(
    starting_timestamp: f64,
    freq: f64,
    length: usize,
) -> Result<Vec<f64>, String> {
    let mut result = Vec::<f64>::with_capacity(length);
    let mut current = starting_timestamp as f64;

    for _ in 0..length {
        result.push(current);
        current = current + freq; // Use saturating_add to prevent overflow
    }
    Ok(result)
}
