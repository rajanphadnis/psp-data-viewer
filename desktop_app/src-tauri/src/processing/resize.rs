use polars::{
    frame::DataFrame,
    prelude::{AsofJoinBy, AsofStrategy, Column},
};

use crate::{calc_dataset, DataChannel};

pub fn calc_resize_datasets(
    dataframes: Vec<DataFrame>,
    channels_info: Vec<DataChannel>,
    save_raw_data: bool,
) -> Result<DataFrame, String> {
    let empty_list: Vec<f64> = Vec::new();
    let mut master_df = match DataFrame::new(vec![Column::new("time".into(), empty_list)]) {
        Ok(d) => d,
        Err(e) => return Err(String::from(format!("failed to init dataframe: {}", e))),
    };
    for dataframe in dataframes {
        let channel_base_name = dataframe
            .get_column_names_str()
            .iter()
            .filter(|col| !col.ends_with("_time"))
            .next()
            .ok_or(format!(
                "failed to read default channel base name: {}",
                dataframe
            ))?
            .to_string();
        let channel_info = channels_info
            .iter()
            .filter(|i| i.channel_name == channel_base_name)
            .next()
            .ok_or(format!(
                "failed to find default datachannel item: {}",
                channel_base_name
            ))?;

        println!(
            "{} channel_info: {}",
            channel_base_name, channel_info.channel_type
        );

        let df = calc_dataset(dataframe, channel_base_name.clone(), channel_info, save_raw_data)
            .map_err(|e| e)?;

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
    Ok(master_df)
}
