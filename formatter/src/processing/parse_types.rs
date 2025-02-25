use dioxus::logger::tracing::info;
use polars::prelude::*;
use std::time::SystemTime;
use tdms::data_type::TdmsDataType;
use tdms::segment::Channel;
use tdms::TDMSFile;

pub fn process_channel_data(
    channel_name: &String,
    data: &Channel,
    tdms_file: &TDMSFile,
) -> Result<Column, Box<dyn std::error::Error>> {
    info!("{}", *channel_name);
    // Determine the type from the first element and convert all data to that type
    info!("{:?}", data.data_type);
    match data.data_type {
        TdmsDataType::DoubleFloat(_) => {
            let values = tdms_file.channel_data_double_float(data);
            match values {
                Ok(v) => {
                    let now = SystemTime::now();
                    let vals: Vec<f64> = v.collect();
                    match now.elapsed() {
                        Ok(elapsed) => {
                            info!("Processing time: {}", elapsed.as_secs());
                        }
                        Err(e) => {
                            info!("Error: {e:?}");
                        }
                    }
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::SingleFloat(_) => {
            let values = tdms_file.channel_data_single_float(data);
            match values {
                Ok(v) => {
                    let vals: Vec<f32> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::ComplexDoubleFloat(_) => {
            let values = tdms_file.channel_data_complex_double_float(data);
            match values {
                Ok(v) => {
                    let vals: Vec<f64> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::Boolean(_) => {
            let values = tdms_file.channel_data_bool(data);
            match values {
                Ok(v) => {
                    let vals: Vec<bool> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::ComplexSingleFloat(_) => {
            let values = tdms_file.channel_data_complex_single_float(data);
            match values {
                Ok(v) => {
                    let vals: Vec<f32> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::DoubleFloatWithUnit(_) => {
            let values = tdms_file.channel_data_double_float_unit(data);
            match values {
                Ok(v) => {
                    let vals: Vec<f64> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::I64(_) => {
            let values = tdms_file.channel_data_i64(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i64> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::I32(_) => {
            let values = tdms_file.channel_data_i32(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i32> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::I16(_) => {
            let values = tdms_file.channel_data_i16(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i16> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::I8(_) => {
            let values = tdms_file.channel_data_i8(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i8> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::SingleFloatWithUnit(_) => {
            let values = tdms_file.channel_data_single_float_unit(data);
            match values {
                Ok(v) => {
                    let vals: Vec<f32> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::String => {
            let values = tdms_file.channel_data_string(data);
            match values {
                Ok(v) => {
                    let vals: Vec<String> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::TimeStamp(_) => {
            let values = tdms_file.channel_data_timestamp(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i64> = v.filter_map(|v| Some(v.0)).collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::U8(_) => {
            let values = tdms_file.channel_data_u8(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i16> = v.filter_map(|v| Some(v.into())).collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::U16(_) => {
            let values = tdms_file.channel_data_u16(data);
            match values {
                Ok(v) => {
                    let vals: Vec<i32> = v.filter_map(|v| Some(v.into())).collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::U32(_) => {
            let values = tdms_file.channel_data_u32(data);
            match values {
                Ok(v) => {
                    let vals: Vec<u32> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        TdmsDataType::U64(_) => {
            let values = tdms_file.channel_data_u64(data);
            match values {
                Ok(v) => {
                    let vals: Vec<u64> = v.collect();
                    Ok(Series::into_column(Series::new(channel_name.into(), vals)))
                }
                Err(e) => {
                    return Err(Box::new(std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!("Error parsing channel: {}", e),
                    )))
                }
            }
        }
        _ => Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!("Unsupported data type for channel {}", channel_name),
        ))),
    }
}
