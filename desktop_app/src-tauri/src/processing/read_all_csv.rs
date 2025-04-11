use crate::{gen_csv_df, types::CsvFile};
use polars::{
    frame::DataFrame, functions::concat_df_diagonal, prelude::Column
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
        let mut raw_df = gen_csv_df(file.file_path.clone()).await.map_err(|e| e)?;
        let first_item: f64 = match raw_df.column("time").unwrap().head(Some(1)).get(0).unwrap() {
            polars::prelude::AnyValue::Float64(val) => val,
            _ => return Err(String::from("Unexpected data type in 'time' column")),
        };
        println!("{:?}", first_item);
        if first_item >= 1e16 {
            // divide by 1000000
            app.emit(
                "event-log",
                format!("csv_gather::convert_from_ns::{}", &file.file_path),
            )
            .unwrap();
        println!("DIVIDING FOR NANOSECONDS");
            raw_df = match raw_df.apply("time", |t| t / 1000000){
                Ok(d) => d.clone(),
                Err(e) => {
                    return Err(String::from(format!(
                        "failed to add csv delay to file '{}': {}",
                        file.file_path,
                        e
                    )))
                }
            }
        }
        let df = match raw_df.apply("time", |t| t + file.csv_delay) {
            Ok(d) => d,
            Err(e) => {
                return Err(String::from(format!(
                    "failed to add csv delay to file '{}': {}",
                    file.file_path,
                    e
                )))
            }
        };
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
        master_df = match concat_df_diagonal(&[master_df, df.clone()]) 
        // master_df = match df.join_asof_by(
        //     &master_df,
        //     "time",
        //     "time",
        //     ["time"],
        //     ["time"],
        //     AsofStrategy::Nearest,
        //     None,
        //     true,
        //     true,
        // ) 
        {
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
