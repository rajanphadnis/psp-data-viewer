use polars::{
    df,
    prelude::{concat, IntoLazy, LazyFrame, SortMultipleOptions, UnionArgs},
};
use std::collections::HashMap;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn stack_data(
    dataset1: HashMap<String, Vec<f64>>,
    dataset2: HashMap<String, Vec<f64>>,
    channel_name: String,
) -> Result<HashMap<String, Vec<Option<f64>>>, String> {
    // Spawn a new thread to do the processing
    task::spawn_blocking(move || {
        let df1 = match generate_df(dataset1) {
            Ok(d) => d,
            Err(e) => return Err(e),
        };
        let df2 = match generate_df(dataset2) {
            Ok(d) => d,
            Err(e) => return Err(e),
        };
        let vertical_concat = match concat([df1, df2], UnionArgs::default()) {
            Ok(d) => match d
                .unique(None, polars::frame::UniqueKeepStrategy::Any)
                .sort(
                    ["time"],
                    SortMultipleOptions::default().with_order_descending(false),
                )
                .collect()
            {
                Ok(f) => {
                    println!("{}", f);
                    let mut hashmap_to_return = HashMap::<String, Vec<Option<f64>>>::new();
                    let data = match f.column(&channel_name) {
                        Ok(col) => match col.f64() {
                            Ok(arr) => arr.into_iter().collect(),
                            Err(e) => return Err(format!("failed to collect data terms: {}", e)),
                        },
                        Err(e) => return Err(format!("failed fetch data after concat: {}", e)),
                    };
                    let time = match f.column("time") {
                        Ok(col) => match col.f64() {
                            Ok(arr) => arr.into_iter().collect(),
                            Err(e) => return Err(format!("failed to collect data terms: {}", e)),
                        },
                        Err(e) => return Err(format!("failed fetch time after concat: {}", e)),
                    };
                    hashmap_to_return.insert(channel_name.clone(), data);
                    hashmap_to_return.insert("time".to_string(), time);
                    hashmap_to_return
                }
                Err(e) => return Err(format!("failed to concat: {}", e)),
            },
            Err(e) => return Err(format!("failed to concat: {}", e)),
        };
        Ok(vertical_concat)
    })
    .await
    .unwrap_or(Err(String::from("Failed to start multi-threaded runner")))
}

fn generate_df(mut dataset: HashMap<String, Vec<f64>>) -> Result<LazyFrame, String> {
    let keys: Vec<String> = dataset.keys().cloned().collect();
    let channel_name = match keys.iter().filter(|key| !key.ends_with("_time")).next() {
        Some(n) => n,
        None => return Err(String::from("Failed to start multi-threaded runner")),
    };
    let time_channel = format!("{}_time", channel_name);

    let channel_data = match dataset.remove(channel_name) {
        Some(data) => data,
        None => return Err(format!("Channel {} not found", channel_name)),
    };

    let time_data = match dataset.remove(&time_channel) {
        Some(data) => data,
        None => return Err(format!("Time channel {} not found", time_channel)),
    };

    let df = match df!(
        channel_name => channel_data,
        "time" => time_data,
    ) {
        Ok(d) => d.lazy(),
        Err(e) => return Err(format!("failed to create dataframe during stacking: {}", e)),
    };
    Ok(df)
}
