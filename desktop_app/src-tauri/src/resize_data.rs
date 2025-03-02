use polars::{
    df,
    frame::DataFrame,
    prelude::{AsofJoinBy, AsofStrategy, Column, SortMultipleOptions},
};
use std::collections::HashMap;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn resize_data(
    data: HashMap<String, Vec<Option<f64>>>,
) -> Result<HashMap<String, Vec<Option<f64>>>, String> {
    task::spawn_blocking(move || {
        let keys: Vec<String> = data.keys().cloned().collect();
        let unique_channels = keys
            .iter()
            .filter(|key| !(key.ends_with("_time") || key.ends_with("_raw__raw__")));
        let empty_list: Vec<f64> = Vec::new();
        let mut master_df = match DataFrame::new(vec![Column::new("time".into(), empty_list)]) {
            Ok(d) => d,
            Err(e) => return Err(String::from(format!("failed to init dataframe: {}", e))),
        };
        for channel in unique_channels {
            let channel_name = match channel.split("__").next() {
                Some(t) => t,
                None => return Err(String::from(format!("couldn't parse channel: {}", channel))),
            };
            let includes_raw = keys
                .iter()
                .any(|key| *key == format!("{}_raw__raw__", channel_name));

            let df = match if includes_raw {
                df!(
                    channel => &data[channel],
                    format!("{}_raw", channel_name) => &data[&format!("{}_raw__raw__", channel_name)],
                    "time" => &data[&format!("{}_time", channel_name)],
                )
            } else {
                df!(
                    channel => &data[channel],
                    "time" => &data[&format!("{}_time", channel_name)],
                )
            } {
                Ok(d) => d,
                Err(e) => return Err(format!("failed to create dataframe during stacking: {}", e)),
            };

            let sorted_df = match df.sort(
                ["time"],
                SortMultipleOptions::new().with_order_descending(false),
            ) {
                Ok(d) => d,
                Err(e) => {
                    return Err(String::from(format!(
                        "failed to sort dataframe by time: {}",
                        e
                    )))
                }
            };

            println!(
                "Resizing channel: {}: includes_raw: {}",
                channel_name, includes_raw
            );

            master_df = match sorted_df.join_asof_by(
                &master_df,
                "time",
                "time",
                ["time"],
                ["time"],
                AsofStrategy::Nearest,
                None,
                true,
                true,
            ) {
                Ok(d) => d,
                Err(e) => {
                    return Err(String::from(format!(
                        "failed to sort dataframe by time: {}",
                        e
                    )))
                }
            };
            println!("Finished resizing channel: {}", channel_name);
            println!("{}", master_df);
        }
        println!("sorting and collecting...");
        println!("{}", master_df);
        let result = match master_df.sort(
            ["time"],
            SortMultipleOptions::default().with_order_descending(false),
        ) {
            Ok(f) => {
                println!("{}", f);
                let mut hashmap_to_return = HashMap::<String, Vec<Option<f64>>>::new();
                let channels = f.get_column_names();
                for channel in channels {
                    let data = match f.column(&channel) {
                        Ok(col) => match col.f64() {
                            Ok(arr) => arr.into_iter().collect(),
                            Err(e) => return Err(format!("failed to collect data terms: {}", e)),
                        },
                        Err(e) => return Err(format!("failed fetch data after concat: {}", e)),
                    };
                    hashmap_to_return.insert(channel.to_string(), data);
                }
                Ok(hashmap_to_return)
            }
            Err(e) => return Err(format!("failed to concat: {}", e)),
        };
        println!("finished resizing");
        result
    })
    .await
    .unwrap_or(Err(String::from("Failed to start multi-threaded runner")))
    // Err(String::from("failed to start runner"))
}
