#[derive(Clone)]
#[derive(serde::Deserialize)]
pub struct DataFile {
    pub path: String,
    pub is_TDMS: bool,
    pub groups: Vec<DataGroup>,
    pub TDMS_VERSION: String,
    pub BITMASK: String,
    pub name: String,
    pub starting_timestamp_millis: f64,
}
#[derive(Clone)]
#[derive(serde::Deserialize)]
pub struct DataGroup {
    pub groupName: String,
    pub channels: Vec<DataChannel>,
}

#[derive(Clone)]
#[derive(Debug)]
#[derive(serde::Deserialize)]
pub struct DataChannel {
    pub channel_name: String,
    pub data: Option<Vec<f64>>,
    pub time: Option<Vec<f64>>,
    pub offset: Option<f64>,
    pub slope: Option<f64>,
    pub unit: String,
    zeroing_target: Option<f64>,
    pub zeroing_correction: Option<f64>,
    minimum: Option<f64>,
    maximum: Option<f64>,
    description: Option<String>,
    pub channel_type: String,
    tc_type: Option<String>,
    constant_cjc: Option<f64>,
    state: i8,
}
