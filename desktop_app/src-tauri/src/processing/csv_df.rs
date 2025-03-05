use polars::{frame::DataFrame, io::SerReader, prelude::*};
use tokio::task;

pub async fn gen_csv_df(file_path: String) -> Result<DataFrame, String> {
    let dataframe = task::spawn_blocking(move || {
        let result: Result<DataFrame, String> = (|| {
            let mut df_raw = CsvReadOptions::default()
                .map_parse_options(|parse_options| parse_options.with_try_parse_dates(false))
                .try_into_reader_with_file_path(Some(file_path.into()))
                .unwrap()
                .finish()
                .unwrap()
                .lazy();

            let binding = df_raw
                .collect_schema()
                .map_err(|e| format!("Failed to read CSV schema: {}", e))?;
            let time_dtype = binding
                .get("time")
                .ok_or("Failed to find column 'time' in CSV file schema")?;
            println!("time column is of type: {:?}", time_dtype);

            let df_time_ms = if *time_dtype == DataType::String {
                df_raw.with_columns([col("time")
                    .str()
                    .to_datetime(
                        Some(TimeUnit::Milliseconds),
                        None,
                        StrptimeOptions {
                            format: Some("%+".into()),
                            strict: false,
                            exact: true,
                            cache: false,
                        },
                        lit("raise"),
                    )
                    .dt()
                    .timestamp(TimeUnit::Milliseconds)])
            } else {
                df_raw
            };

            let df_converted_int = df_time_ms
                .with_column(dtype_col(&DataType::Int8).cast(DataType::Float64))
                .with_column(dtype_col(&DataType::Int16).cast(DataType::Float64))
                .with_column(dtype_col(&DataType::Int32).cast(DataType::Float64))
                .with_column(dtype_col(&DataType::Int64).cast(DataType::Float64))
                .with_column(dtype_col(&DataType::Int128).cast(DataType::Float64));

            println!("{:?}", time_dtype);
            let df_to_return = df_converted_int.collect().map_err(|e| {
                format!(
                    "failed to parse time column to date. Not ISO 8601 format: {}",
                    e
                )
            })?;
            Ok(df_to_return)
        })();
        result
    })
    .await
    .map_err(|e| {
        format!(
            "Failed to start multi-threaded runner for tdms dataframe compilation: {}",
            e
        )
    })?
    .map_err(|e| e)?;
    Ok(dataframe)
}
