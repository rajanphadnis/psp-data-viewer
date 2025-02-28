mod create_hdf5;
mod get_all_channels;
mod process_tdms;
mod read_data;
mod get_tdms_name;

pub use read_data::read_data;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_all_channels::get_all_channels,
            process_tdms::process_channel_data,
            create_hdf5::create_hdf5,
            get_tdms_name::get_tdms_name,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
