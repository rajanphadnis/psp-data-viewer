mod add_file;
mod compile;
mod create_timeframe;
mod processing;
mod read_individual_channel;
mod types;

pub use add_file::csv::get_csv_info;
pub use add_file::get_all_channels::get_all_channels;
pub use add_file::get_tdms_name::get_tdms_name;
pub use processing::calc::calc_dataset;
pub use processing::csv_df::gen_csv_df;
pub use processing::resize::calc_resize_datasets;
pub use processing::save::save_dataframe;
pub use processing::stack::stack_duplicate_channels;
pub use read_individual_channel::process_channel_data::process_channel_data;
pub use read_individual_channel::read_csv::read_channel;
pub use types::DataChannel;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            add_file::get_all_channels::get_all_channels,
            read_individual_channel::process_channel_data::process_channel_data,
            add_file::get_tdms_name::get_tdms_name,
            create_timeframe::create_timeframe,
            compile::compile,
            add_file::csv::get_csv_info,
            read_individual_channel::read_csv::read_channel
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
