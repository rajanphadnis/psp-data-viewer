use hdf5::File;
use ndarray::Array1;
use polars::frame::DataFrame;

pub fn save_dataframe(master_df: DataFrame, file: File) -> Result<(usize, usize), String> {
    for col in master_df.get_column_names_str() {
        let data_with_null: Vec<Option<f64>> = match master_df.column(col) {
            Ok(col) => match col.f64() {
                Ok(arr) => arr.into_iter().collect(),
                Err(e) => return Err(format!("failed to collect data terms: {}", e)),
            },
            Err(e) => return Err(format!("failed fetch data after concat: {}", e)),
        };

        let data: Vec<f64> = data_with_null
            .iter()
            .map(|e| match e {
                Some(t) => *t,
                None => f64::NAN,
            })
            .collect();

        println!("create channel: {}", col);
        println!("Data length: {}", data.len());
        let array = Array1::from_vec(data);
        println!("Array shape: {:?}", array.shape());
        println!("to_write: {}: {}", col, array);

        // Create the dataset with the correct dimensions
        let dataset = match file.new_dataset::<f64>().shape(array.shape()).create(col) {
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
    Ok(master_df.shape())
}
