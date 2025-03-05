use std::{
    collections::HashMap,
    path::Path,
    str::{self, from_utf8},
};
use tdms::TDMSFile;

#[tauri::command(rename_all = "snake_case")]
pub fn get_all_channels(
    path_string: &str,
) -> Result<HashMap<String, Vec<HashMap<String, String>>>, String> {
    let tdms_file = match TDMSFile::from_path(Path::new(&path_string)) {
        Ok(file) => file,
        Err(e) => {
            return Err(String::from(format!("Failed to open TDMS file: {}", e)));
        }
    };
    let mut channel_info = HashMap::<String, Vec<HashMap<String, String>>>::new();
    let groups = &tdms_file.groups();
    for group in groups {
        let channels = tdms_file.channels(group);
        for channel in channels {
            let channel_path = channel.1.full_path.clone();
            let mut channel_all_metadata = Vec::<HashMap<String, String>>::new();
            for prop in channel.1.properties.iter() {
                let mut channel_metadata = HashMap::<String, String>::new();
                let prop_name = prop.name.clone();
                // println!("Data type: {:?}", prop.data_type);
                let prop_val = match prop.data_type {
                    tdms::data_type::TdmsDataType::DoubleFloat(_) => {
                        match prop.value.value.clone() {
                            Some(v) => match prop.value.endianness {
                                tdms::segment::Endianness::Little => match v.try_into() {
                                    Ok(bytes) => f64::from_le_bytes(bytes).to_string(),
                                    Err(_) => String::from("value didn't satisfy 8 byte req (le)"),
                                },
                                tdms::segment::Endianness::Big => match v.try_into() {
                                    Ok(bytes) => f64::from_be_bytes(bytes).to_string(),
                                    Err(_) => String::from("value didn't satisfy 8 byte req (be)"),
                                },
                            },
                            None => String::from("null"),
                        }
                    }
                    tdms::data_type::TdmsDataType::String => match prop.value.value.clone() {
                        Some(v) => match from_utf8(&v) {
                            Ok(v) => String::from(v),
                            Err(e) => {
                                println!("Error converting to string: {:?}", e);
                                String::from("failed")
                            }
                        },
                        None => String::from("null"),
                    },
                    _ => String::from("unsupported data type"),
                };
                channel_metadata.insert(prop_name, prop_val);
                channel_all_metadata.push(channel_metadata);
            }
            channel_info.insert(channel_path, channel_all_metadata);
        }
    }
    return Ok(channel_info);
}
