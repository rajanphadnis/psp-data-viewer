use polars::{
    frame::DataFrame,
    prelude::{col, IntoLazy, SortMultipleOptions},
};

use crate::DataChannel;

pub fn calc_dataset(
    dataframe: DataFrame,
    channel_base_name: String,
    channel_info: &DataChannel,
    save_raw_data: bool,
) -> Result<DataFrame, String> {
    let selected_df = if channel_info.channel_type.contains("AI") {
        let slope = channel_info.slope.expect("Missing slope val");
        let offset = channel_info.offset.expect("Missing offset val");
        let zeroing_correction = channel_info
            .zeroing_correction
            .expect("Missing zeroing_correction val");
        let calculated_col = ((col(channel_base_name.clone()) * slope.into())
            + offset.into()
            + zeroing_correction.into())
        .alias(format!("{}__{}__", channel_base_name, channel_info.unit));
        if save_raw_data {
            dataframe
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
                .map_err(|e| format!("failed to apply calcs to channel: {}", e))?
        } else {
            dataframe
                .lazy()
                .with_column(calculated_col)
                .select([
                    col(format!(
                        "{}__{}__",
                        channel_base_name.clone(),
                        channel_info.unit
                    )),
                    col(format!("{}_time", channel_base_name.clone())).alias("time"),
                ])
                .collect()
                .map_err(|e| format!("failed to apply calcs to channel: {}", e))?
        }
    } else {
        dataframe
            .lazy()
            .select([
                col(format!("{}_time", channel_base_name.clone())).alias("time"),
                col(channel_base_name.clone())
                    .alias(format!("{}__{}__", channel_base_name, channel_info.unit)),
            ])
            .collect()
            .map_err(|e| {
                format!(
                    "Failed to collect renamed datasets into eager frame for channel '{}': {}",
                    channel_base_name, e
                )
            })?
    };

    let df = selected_df
        .sort(
            ["time"],
            SortMultipleOptions::new().with_order_descending(false),
        )
        .map_err(|e| format!("failed to sort dataset '{}': {}", channel_base_name, e))?;
    Ok(df)
}
