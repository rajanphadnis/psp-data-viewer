use csv::StringRecord;
use std::{collections::HashMap, time::Instant};

pub async fn run_all_checks(headers: &StringRecord, records: &Vec<StringRecord>) -> HashMap<String, bool> {
    let columns = headers.len();
    let mut to_return = HashMap::new();
    to_return.insert("1.Valid CSV".to_string(),identical_record_entries(records, columns));
    to_return.insert("2.Header Check".to_string(),check_headers(headers));

    return to_return;
}

fn identical_record_entries(records: &Vec<StringRecord>, length: usize) -> bool {
    let mut to_return = true;
    // Start timing
    let start = Instant::now();
    for (index, record) in records.iter().enumerate() {
        if record.len() != length {
            println!(
                "Entry at index {} has a different length: {} (expected length: {})",
                index,
                record.len(),
                length
            );
            to_return = false;
        }
    }
    // Stop timing
    let duration = start.elapsed();
    println!("Checked CSV record count in {:?}", duration);
    return to_return;
}

fn check_headers(_headers: &StringRecord) -> bool {
    // for header in headers {
    //     println!("{:?}", header);
    // }
    // let mut to_return = StringRecord::new();
    // to_return.push_field("test");
    return false;
}
