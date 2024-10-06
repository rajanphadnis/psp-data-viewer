use csv::StringRecord;
use std::fs::File;
pub mod checks;
pub mod components;


pub async fn get_file_records(path: &str) -> (Option<StringRecord>, Option<Vec<StringRecord>>) {
    println!("Loading CSV...");
    let file = File::open(path).expect("File");
    let mut rdr = csv::ReaderBuilder::new()
        .has_headers(true)
        .from_reader(file);
    let headers = rdr.headers().map(|record| record.clone()).expect("header");
    let records: Vec<StringRecord> = rdr
        .records()
        .map(|record| record.expect("CSV record"))
        .collect();
    println!("CSV loaded");

    return (Some(headers), Some(records));
}