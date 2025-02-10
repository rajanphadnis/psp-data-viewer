use dioxus::logger::tracing::info;
use polars::{
    frame::DataFrame,
    prelude::{IntoColumn, NamedFrom},
    series::Series,
};
use rayon::prelude::*;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::{path::Path, sync::Mutex, time::SystemTime};
use tdms::{data_type::TdmsDataType, TDMSFile};
use tokio::{sync::mpsc::Sender, task};

pub fn create(path_string: String, tx: Sender<String>) {
    task::spawn(async move {
        // Open and read the TDMS file
        // D:\psp-data-viewer\formatter\DataLog_2024-0501-0002-02_CMS_Data_Wiring_6.tdms
        // DataLog_2024-0501-0002-02_CMS_Data_Wiring_6.tdms
        // "D:\\psp-data-viewer\\formatter\\DataLog_2024-0501-0002-02_CMS_Data_Wiring_5.tdms"
        tx.send(String::from("Reading File...")).await.unwrap();
        let tdms_file = match TDMSFile::from_path(Path::new(&path_string)) {
            Ok(file) => {
                let segments = file.clone().segments;
                for seg in segments {
                    let lead = seg.clone().lead_in;
                    info!("ToC: {}", lead.table_of_contents);
                    let meta = seg.clone().metadata.unwrap().objects;
                    for ob in meta {
                        info!("{}: {}", seg.chunk_size, ob.object_path);
                        match ob.raw_data_index {
                            Some(raw_dat) => {
                                info!("num of vals: {}", raw_dat.number_of_values);
                                info!("dim: {}", raw_dat.array_dimension);
                            }
                            None => info!("No raw data"),
                        }
                    }
                };
                // info!("number of segments: {}", seg);
                // info!("metadata: {}", meta.objects.);
                file
            }
            Err(e) => {
                info!("Failed to open TDMS file: {}", e);
                return false;
            }
        };

        let groups = tdms_file.groups();
        let channels = tdms_file.channels(&groups[0]);
        let list_of_series = Mutex::new(Vec::with_capacity(channels.len()));
        let now = SystemTime::now();

        // Convert channels into a vector for parallel processing
        let channel_vec: Vec<_> = channels.into_iter().collect();
        let num_of_channels = channel_vec.iter().size_hint().0;
        tx.send(format!("Collecting {} Channels...", num_of_channels))
            .await
            .unwrap();
        let current_processing = AtomicUsize::new(0);

        // tx.send(format!("Reading Channels...")).await.unwrap();

        // Process channels in parallel
        channel_vec.par_iter().for_each(|(channel_name, channel)| {
            info!("-----{}-----", channel_name);
            let data = match channel.data_type {
                TdmsDataType::DoubleFloat(_) => tdms_file.channel_data_double_float(channel),
                _ => {
                    panic!("{}", "channel for data type unimplemented")
                }
            };
            // let cdat = data.unwrap().cloned();
            let count = current_processing.fetch_add(1, Ordering::Relaxed) + 1;
            tx.blocking_send(format!(
                "Processing {} of {} channels",
                count, num_of_channels
            ))
            .unwrap();

            if let Ok(channel_data) = data {
                // let num_of_datapoints = channel_data.size_hint().0;
                // info!("{} datapoints: {}", channel_name, num_of_datapoints);
                let mut channel_datapoints: Vec<f64> = Vec::with_capacity(0);
                // let mut current_percent = 0;

                for (_, value) in channel_data.enumerate() {
                    // let percent = 100 * (i / num_of_datapoints);

                    // if percent > current_percent + 1 {
                    //     info!("{}: {}%", channel_name, percent);
                    //     current_percent = percent;
                    // }

                    channel_datapoints.push(value);
                }
                // let thing: Vec<f64> = channel_data.collect();
                let s = Series::into_column(Series::new(
                    String::from(channel_name).into(),
                    &channel_datapoints,
                ));

                // Safely append to the shared vector
                if let Ok(mut series_vec) = list_of_series.lock() {
                    series_vec.push(s);
                }
            } else if let Err(er) = data {
                info!("error: {}", er);
            }
        });

        match now.elapsed() {
            Ok(elapsed) => {
                info!("Elapsed time: {}", elapsed.as_secs());
            }
            Err(e) => {
                info!("Error: {e:?}");
            }
        }

        tx.send(String::from("fin")).await.unwrap();
        info!("Creating df");
        let series_vec = list_of_series.lock().unwrap();
        let dataframe_process = DataFrame::new(series_vec.to_vec());
        match dataframe_process {
            Ok(dataframe) => {
                info!("{:?}", dataframe);
                return true;
            }
            Err(df_err) => {
                info!("Error creating dataframe: {}", df_err);
                return false;
            }
        }
    });
}
