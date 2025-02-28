#[tauri::command(rename_all = "snake_case")]
pub async fn create_timeframe(
    starting_timestamp: u64,
    freq: u64,
    length: usize,
) -> Result<Vec<u64>, String> {
    let mut result = Vec::<u64>::with_capacity(length);
    let mut current = starting_timestamp;

    for _ in 0..length {
        result.push(current);
        current = current.saturating_add(freq); // Use saturating_add to prevent overflow
    }
    Ok(result)
}
