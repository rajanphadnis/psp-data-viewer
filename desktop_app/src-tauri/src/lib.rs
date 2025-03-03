mod compile;
mod create_timeframe;
mod get_all_channels;
mod get_tdms_name;
mod process_channel_data;
mod processing;
mod types;

pub use processing::calc::calc_dataset;
pub use processing::resize::calc_resize_datasets;
pub use processing::save::save_dataframe;
pub use processing::stack::stack_duplicate_channels;
pub use types::DataChannel;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_all_channels::get_all_channels,
            process_channel_data::process_channel_data,
            get_tdms_name::get_tdms_name,
            create_timeframe::create_timeframe,
            compile::compile
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
