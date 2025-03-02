use crate::DataChannel;
use hdf5::File;
use ndarray::Array1;
use polars::{
    frame::DataFrame,
    prelude::{col, AsofJoinBy, AsofStrategy, Column, IntoLazy, NamedFrom, SortMultipleOptions},
    series::Series,
};
use std::{collections::HashMap, time::SystemTime};
use tauri_plugin_dialog::DialogExt;
use tokio::task;

#[tauri::command(rename_all = "snake_case")]
pub async fn calc_resize_save(
    app: tauri::AppHandle,
    data: HashMap<String, Vec<f64>>,
    channels_info: Vec<DataChannel>,
) -> Result<u64, String> {
    // Spawn a new thread to do the processing
    match task::spawn_blocking(move || {
        // Create or open the file
        let file = match File::create(
            match match app
            .dialog()
            .file()
            .add_filter("Dataviewer.Space Test File", &["hdf5"])
            .blocking_save_file() {
                Some(file) => file,
                None => return Err(String::from("Closed file picker dialog")),
            }
            .into_path()
            {
                Ok(f) => f,
                Err(e) => return Err(format!("Failed to get path: {}", e)),
            },
        ) {
            Ok(f) => f,
            Err(e) => return Err(format!("Failed to create file: {}", e)),
        };
        let empty_list: Vec<f64> = Vec::new();
        let mut master_df = match DataFrame::new(vec![Column::new("time".into(), empty_list)]) {
            Ok(d) => d,
            Err(e) => return Err(String::from(format!("failed to init dataframe: {}", e))),
        };
        println!("Creating dataframes");
        let now = SystemTime::now();
        let dataframes = match create_dataframes(data) {
            Ok(d) => d,
            Err(e) => {
                return Err(e);
            }
        };

        for dataframe in dataframes {
            let channel_base_name = match dataframe
                .get_column_names_str()
                .iter()
                .filter(|col| !col.ends_with("_time"))
                .next()
            {
                Some(c) => c.to_string(),
                None => {
                    return Err(format!(
                        "failed to read default channel base name: {}",
                        dataframe
                    ))
                }
            };
            // println!("{} dataframe: {}", channel_base_name, dataframe);
            let channel_info = match channels_info
                .iter()
                .filter(|i| i.channel_name == channel_base_name)
                .next()
            {
                Some(c) => c,
                None => {
                    return Err(format!(
                        "failed to find default datachannel item: {}",
                        channel_base_name
                    ))
                }
            };
            println!(
                "{} channel_info: {}",
                channel_base_name, channel_info.channel_type
            );
            let df = if channel_info.channel_type.contains("AI") {
                let slope = channel_info.slope.expect("Missing slope val");
                let offset = channel_info.offset.expect("Missing offset val");
                let zeroing_correction = channel_info
                    .zeroing_correction
                    .expect("Missing zeroing_correction val");
                let calculated_col = ((col(channel_base_name.clone()) * slope.into())
                    + offset.into()
                    + zeroing_correction.into())
                .alias(format!("{}__{}__", channel_base_name, channel_info.unit));
            // TODO: add if (saveRawData) toggle here
                let t = match dataframe
                    .lazy()
                    .with_column(calculated_col)
                    .select([
                        col(format!(
                            "{}__{}__",
                            channel_base_name.clone(),
                            channel_info.unit
                        )),
                        col(format!("{}_time", channel_base_name.clone())).alias("time"),
                        col(channel_base_name.clone())
                            .alias(format!("{}_raw__raw__", channel_base_name)),
                    ])
                    .collect()
                {
                    Ok(d) => match d.sort(
                        ["time"],
                        SortMultipleOptions::new().with_order_descending(false),
                    ) {
                        Ok(s) => s,
                        Err(e) => {
                            return Err(format!(
                                "failed to sort dataset '{}': {}",
                                channel_base_name, e
                            ))
                        }
                    },
                    Err(e) => return Err(format!("failed to apply calcs to channel: {}", e)),
                };
                t
            } else {
                match dataframe
                    .lazy()
                    .select([
                        col(format!("{}_time", channel_base_name.clone())).alias("time"),
                        col(channel_base_name.clone())
                            .alias(format!("{}__{}__", channel_base_name, channel_info.unit)),
                    ])
                    .collect()
                {
                    Ok(d) => match d.sort(
                        ["time"],
                        SortMultipleOptions::new().with_order_descending(false),
                    ) {
                        Ok(s) => s,
                        Err(e) => {
                            return Err(format!(
                                "failed to sort dataset '{}': {}",
                                channel_base_name, e
                            ))
                        }
                    },
                    Err(e) => {
                        return Err(format!(
                        "Failed to collect renamed datasets into eager frame for channel '{}': {}",
                        channel_base_name, e
                    ))
                    }
                }
            };
            println!("{} final df: {}", channel_base_name, df);
            master_df = match df.join_asof_by(
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
            println!("Finished resizing channel: {}", channel_base_name);
            println!("{}", master_df);
        }

        // let mut hashmap_to_write = HashMap::<String, Vec<Option<f64>>>::new();
        for col in master_df.get_column_names_str() {
            let data: Vec<f64> = match master_df.column(col) {
                Ok(col) => match col.f64() {
                    Ok(arr) => arr.into_no_null_iter().collect(),
                    Err(e) => return Err(format!("failed to collect data terms: {}", e)),
                },
                Err(e) => return Err(format!("failed fetch data after concat: {}", e)),
            };
            println!("create channel: {}", col);
            println!("Data length: {}", data.len());
            let array = Array1::from_vec(data);
            println!("Array shape: {:?}", array.shape());

            // Create the dataset with the correct dimensions
            let dataset = match file
                .new_dataset::<f64>()
                .shape(array.shape())
                .create(col)
            {
                Ok(ds) => ds,
                Err(e) => return Err(format!("Failed to create dataset: {}", e)),
            };

            // Get slice data
            let slice_data = match array.as_slice() {
                Some(slice) => slice,
                None => return Err("Failed to convert array to slice".to_string()),
            };

            // Create the proper selection type (using the HDF5 crate's Selection types)
            match dataset.write(slice_data) {
                Ok(_) => {
                    println!("Successfully wrote data to HDF5");
                    // Ok(true)
                }
                Err(e) => return Err(format!("Failed to write data: {}", e)),
            };
        }

        match now.elapsed() {
            Ok(elapsed) => {
                println!("Processing time: {}", elapsed.as_secs());
                Ok(elapsed.as_secs())
            }
            Err(e) => Err(format!("failed to time fxn: {}", e)),
        }
    })
    .await
    {
        Ok(t) => t,
        Err(e) => return Err(format!("Failed to start multi-threaded runner: {}", e)),
    }
}

fn create_dataframes(data: HashMap<String, Vec<f64>>) -> Result<Vec<DataFrame>, String> {
    // Group column names by their base name (without "_time" suffix)
    let mut column_pairs: HashMap<String, (Option<String>, Option<String>)> = HashMap::new();

    for column_name in data.keys() {
        if column_name.ends_with("_time") {
            let base_name = column_name.strip_suffix("_time").unwrap();
            let entry = column_pairs
                .entry(base_name.to_string())
                .or_insert((None, None));
            entry.1 = Some(column_name.clone());
        } else {
            let entry = column_pairs
                .entry(column_name.clone())
                .or_insert((None, None));
            entry.0 = Some(column_name.clone());
        }
    }

    // Create a DataFrame for each valid pair
    let mut dataframes = Vec::new();
    // let mut dataframes = HashMap::<String, LazyFrame>::new();
    for (_, (value_col, time_col)) in column_pairs {
        if let (Some(value_col), Some(time_col)) = (value_col, time_col) {
            if let (Some(values), Some(times)) = (data.get(&value_col), data.get(&time_col)) {
                // For efficiency, create series directly from slices
                let channel_name = value_col.clone();
                let value_series = Series::new(value_col.into(), values.as_slice());
                let time_series = Series::new(time_col.into(), times.as_slice());
                println!("{}", channel_name);
                // Create DataFrame
                match DataFrame::new(vec![Column::from(value_series), Column::from(time_series)]) {
                    Ok(df) => {
                        // dataframes.insert(channel_name, df.lazy());
                        dataframes.push(df)
                    }
                    Err(e) => {
                        return Err(String::from(format!(
                            "failed to create dataframe pair: {}",
                            e
                        )))
                    }
                }
            }
        }
    }

    Ok(dataframes)
}
