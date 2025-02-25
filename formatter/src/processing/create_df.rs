use dioxus::logger::tracing::info;
use polars::frame::DataFrame;
use rayon::prelude::*;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::{path::Path, time::SystemTime};
use tdms::{segment::Channel, TDMSFile};
use tokio::{sync::mpsc::Sender, task};

use crate::processing::parse_types::process_channel_data;

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
                }
                // info!("number of segments: {}", seg);
                // info!("metadata: {}", meta.objects.);
                file
            }
            Err(e) => {
                info!("Failed to open TDMS file: {}", e);
                return false;
            }
        };

        let groups = &tdms_file.groups();
        let channels = &tdms_file.channels(&groups[0]);
        // let list_of_series = Mutex::new(Vec::with_capacity(channels.len()));
        let now = SystemTime::now();

        // Convert channels into a vector for parallel processing
        let channel_vec: Vec<(String, &Channel)> = channels.clone().into_iter().collect();
        let num_of_channels = channel_vec.iter().size_hint().0;
        tx.send(format!("Collecting {} Channels...", num_of_channels))
            .await
            .unwrap();
        let current_processing = AtomicUsize::new(0);

        tx.send(format!("Reading Channels...")).await.unwrap();

        let series_vec = channel_vec
            .par_iter()
            .filter_map(|(_, channel)| {
                let channel_name = &channel.path;
                let count = current_processing.fetch_add(1, Ordering::Relaxed) + 1;
                tx.blocking_send(format!(
                    "Processing {} of {} channels",
                    count, num_of_channels
                ))
                .unwrap();
                process_channel_data(&channel_name, channel, &tdms_file).ok()
            })
            .collect();
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
        // Create DataFrame from all Series
        let df: Result<DataFrame, polars::prelude::PolarsError> = DataFrame::new(series_vec);
        // return df;
        match df {
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
