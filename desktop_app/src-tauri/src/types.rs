#[derive(serde::Deserialize)]
pub struct DataChannel {
    pub channel_name: String,
    data: Vec<Option<f64>>,
    time: Vec<Option<f64>>,
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
