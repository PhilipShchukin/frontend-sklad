// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use tauri_plugin_dialog::DialogPlugin;
// use tauri_plugin_fs::FsPlugin;

fn main() {
  app_lib::run();
  // tauri::Builder::default()
  //   .plugin(tauri_plugin_dialog::init())
  //   .plugin(tauri_plugin_fs::init())
  //   .run(tauri::generate_context!())
  //   .expect("error while running tauri application");
}




