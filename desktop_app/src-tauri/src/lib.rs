mod create_hdf5;
mod file_init;
mod process_tdms;
mod read_data;

pub use read_data::read_data;
// use tauri_plugin_fs::FsExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            file_init::get_all_channels,
            process_tdms::process_channel_data,
            create_hdf5::create_hdf5
        ])
        // .setup(|app| {
        //     // allowed the given directory
        //     let scope = app.fs_scope();
        //     let _ = scope.allow_directory("$DESKTOP", true);
        //     dbg!(scope.is_allowed("$DESKTOP"));
  
        //     Ok(())
        //  })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
