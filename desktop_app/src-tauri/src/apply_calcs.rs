use polars::{
    df,
    prelude::{col, IntoLazy},
};
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn apply_calcs(
    data: Vec<Option<f64>>,
    slope: f64,              // slope in y = mx + b
    offset: f64,             // offset in y = mx + b
    zeroing_correction: f64, // offset in y = mx + b
) -> Result<Vec<Option<f64>>, String> {
    // Spawn a new thread to do the processing
    task::spawn_blocking(move || {
        println!("applying calcs");
        let df = match df!(
            "data" => data,
        ) {
            Ok(d) => d.lazy().select([((col("data") * slope.into())
                + offset.into()
                + zeroing_correction.into())
            .alias("data")]),
            Err(e) => {
                return Err(format!(
                    "failed to create lazyframe when applying calcs: {}",
                    e
                ))
            }
        };
        let to_return: Vec<Option<f64>> = match df.collect() {
            Ok(dataframe) => match dataframe.column("data") {
                Ok(col) => match col.f64() {
                    Ok(arr) => arr.into_iter().collect(),
                    Err(e) => {
                        return Err(format!(
                            "failed to parse column into array after applying calcs: {}",
                            e
                        ))
                    }
                },
                Err(e) => {
                    return Err(format!(
                        "failed to fetch dataframe column after applying calcs: {}",
                        e
                    ))
                }
            },
            Err(e) => {
                return Err(format!(
                    "failed to create dataframe after applying calcs: {}",
                    e
                ))
            }
        };
        Ok(to_return)
    })
    .await
    .unwrap_or(Err(String::from(
        "Failed to start multi-threaded runner: apply_calcs",
    )))
}
