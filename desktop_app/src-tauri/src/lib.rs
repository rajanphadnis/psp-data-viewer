mod calc_resize_save;
mod create_timeframe;
mod get_all_channels;
mod get_tdms_name;
mod process_tdms;
mod read_data;
mod stack_data;
mod types;

pub use read_data::read_data;
pub use types::DataChannel;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_all_channels::get_all_channels,
            process_tdms::process_channel_data,
            get_tdms_name::get_tdms_name,
            create_timeframe::create_timeframe,
            stack_data::stack_data,
            calc_resize_save::calc_resize_save,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
