use polars::{
    frame::DataFrame,
    lazy::prelude::concat,
    prelude::{IntoLazy, SortMultipleOptions, UnionArgs},
};
use std::collections::HashMap;

pub fn stack_duplicate_channels(data: Vec<DataFrame>) -> Result<Vec<DataFrame>, String> {
    let mut dataframes = HashMap::<String, DataFrame>::new();
    data.iter()
        .try_for_each(|dataframe| -> Result<(), String> {
            let base_channel_name = dataframe
                .get_column_names_str()
                .iter()
                .filter(|chan| !chan.ends_with("_time"))
                .next()
                .ok_or(format!(
                    "Failed to find channel base name in read TDMS file"
                ))?
                .to_string();

            if dataframes.contains_key(&base_channel_name) {
                println!("Stacking channel: {}", base_channel_name);
                let df_vertical_concat = concat(
                    [
                        dataframe.clone().lazy(),
                        dataframes
                            .get(&base_channel_name)
                            .ok_or(format!(
                                "failed to read existing channel during stacking: {}",
                                base_channel_name
                            ))?
                            .clone()
                            .lazy(),
                    ],
                    UnionArgs::default(),
                )
                .map_err(|e| {
                    format!(
                        "Failed to stack dataframe for channel: '{}': {}",
                        base_channel_name, e
                    )
                })?
                .sort(
                    [format!("{}_time", base_channel_name)],
                    SortMultipleOptions::new().with_order_descending(false),
                )
                .collect()
                .map_err(|e| format!("failed to collect after stacking: {}", e))?;
                dataframes.insert(base_channel_name, df_vertical_concat);
            } else {
                println!("Skipping channel stacking: {}", base_channel_name);
                dataframes.insert(base_channel_name, dataframe.clone());
            }
            Ok(())
        })
        .map_err(|e| e)?;
    Ok(dataframes.into_values().collect())
}
