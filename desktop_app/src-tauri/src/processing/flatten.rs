use crate::{
    create_timeframe::create_timeframe, process_channel_data::read_data, types::DataFile,
    DataChannel,
};
use polars::{
    frame::DataFrame,
    prelude::{Column, NamedFrom},
    series::Series,
};
use std::{
    path::Path,
    sync::{Arc, Mutex},
};
use tdms::TDMSFile;
use tokio::task::{self, JoinHandle};

pub async fn flatten(files: Vec<DataFile>) -> Result<(Vec<DataChannel>, Vec<DataFrame>), String> {
    let channels_info = Arc::new(Mutex::new(Vec::<DataChannel>::new()));
    let channels_dataframes = Arc::new(Mutex::new(Vec::<DataFrame>::new()));

    let mut to_await_on = Vec::<JoinHandle<Result<(), String>>>::new();

    for file in files {
        let file_clone = file.clone();
        let file_path_file = file_clone.path.clone();
        let channels_info_file = Arc::clone(&channels_info);
        let channels_dataframes_file = Arc::clone(&channels_dataframes);
        for group in file.groups {
            let file_path_group = file_path_file.clone();

            let channels_info_group = Arc::clone(&channels_info_file);
            let channels_dataframes_group = Arc::clone(&channels_dataframes_file);
            for channel in group.channels {
                let channels_info_channel = Arc::clone(&channels_info_group);
                let channels_dataframes_channel = Arc::clone(&channels_dataframes_group);
                let file_path_chan = file_path_group.clone();
                let group_name = group.groupName.clone(); // Clone group name to avoid moves
                let to_run = task::spawn_blocking(move || {
                    let result: Result<(), String> = (|| {
                        let tdms_file = TDMSFile::from_path(&Path::new(&file_path_chan)) // Use PathBuf reference here
                        .map_err(|e| format!("Failed to open TDMS file: {}", e))?;
                        let tdms_file = Arc::new(tdms_file); // Wrap in Arc for thread safety
                        let tdms_file_clone = Arc::clone(&tdms_file);
                        let channel_name = channel.channel_name.clone();
                        let file_starting_timestamp = file.starting_timestamp_millis; // Copy timestamp
                        let has_data = channel.data.is_some() && channel.time.is_some();
                        println!("{}: {}", channel_name, has_data);

                        // Get fresh `channels` inside the closure using cloned `group_name`
                        let channels = tdms_file_clone.channels(&group_name);

                        let channel_object = channels
                            .iter()
                            .find(|chan| *chan.0 == channel_name)
                            .ok_or_else(|| {
                            format!("Couldn't find channel: {}", channel_name)
                        })?;

                        let channel_data =
                            read_data(&channel_name, channel_object.1, &tdms_file_clone)
                                .map_err(|e| e)?;

                        let time_data = create_timeframe(
                            file_starting_timestamp,
                            1.0, // Replace with actual frequency parsing logic
                            channel_data.len(),
                        )
                        .map_err(|e| e)?;

                        let value_series =
                            Series::new(channel_name.clone().into(), channel_data.as_slice());
                        let time_series = Series::new(
                            format!("{}_time", channel_name).into(),
                            time_data.as_slice(),
                        );

                        let df = DataFrame::new(vec![
                            Column::from(value_series),
                            Column::from(time_series),
                        ])
                        .map_err(|e| format!("Failed to create dataframe: {}", e))?;

                        println!("{}", df);

                        channels_dataframes_channel.lock().unwrap().push(df);
                        channels_info_channel.lock().unwrap().push(channel);

                        Ok(())
                    })();
                    result
                });

                to_await_on.push(to_run);
            }
        }
    }

    // Wait for all spawned tasks to complete
    for handle in to_await_on {
        handle
            .await
            .map_err(|e| format!("Task failed: {:?}", e))??;
    }

    let mut channels_info = Arc::try_unwrap(channels_info)
        .unwrap()
        .into_inner()
        .unwrap();
    let channels_dataframes = Arc::try_unwrap(channels_dataframes)
        .unwrap()
        .into_inner()
        .unwrap();

    channels_info.sort_by(|a, b| a.channel_name.cmp(&b.channel_name));
    channels_info.dedup_by_key(|chan| chan.channel_name.clone());

    Ok((channels_info, channels_dataframes))
}
