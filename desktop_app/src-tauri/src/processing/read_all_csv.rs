use crate::{gen_csv_df, types::CsvFile};
use polars::{
    frame::DataFrame,
    prelude::{AsofJoinBy, AsofStrategy, Column},
};
use tauri::{AppHandle, Emitter};

pub async fn read_all_csv(csv_files: Vec<CsvFile>, app: AppHandle) -> Result<DataFrame, String> {
    let empty_list: Vec<f64> = Vec::new();
    let mut master_df = match DataFrame::new(vec![Column::new("time".into(), empty_list)]) {
        Ok(d) => d,
        Err(e) => {
            return Err(String::from(format!(
                "failed to init empty CSV master dataframe: {}",
                e
            )))
        }
    };

    for file in csv_files {
        app.emit(
            "event-log",
            format!("csv_gather::start::{}", &file.file_path),
        )
        .unwrap();
        let df = gen_csv_df(file.file_path.clone()).await.map_err(|e| e)?;
        app.emit(
            "event-log",
            format!("csv_gather::complete::{}", &file.file_path),
        )
        .unwrap();
        // println!("{}", df);
        app.emit(
            "event-log",
            format!("csv_resize::start::{}", &file.file_path),
        )
        .unwrap();
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
                    "failed to combine CSV and TDMS-generated dataframes: {}",
                    e
                )))
            }
        };
        // println!("{}", master_df);
        app.emit(
            "event-log",
            format!("csv_resize::complete::{}", &file.file_path),
        )
        .unwrap();
    }

    Ok(master_df)
}
