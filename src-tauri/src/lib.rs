use std::process::{Command, Stdio};
use std::thread;
use std::io::{BufReader, BufRead};
use std::path::Path;

use serde_json::Value;

use tauri::Manager; 

#[tauri::command]
async fn fetch_reports() -> Result<Value, String> {
    let resp = reqwest::get("http://127.0.0.1:8765/ping-backend")
    // let resp = reqwest::get("http://172.16.16.1:8765/ping-backend")
        .await
        .map_err(|e| e.to_string())?
        .json::<Value>()
        .await
        .map_err(|e| e.to_string())?;
    Ok(resp)
}

// pub fn run() {
    
    
  
//     // ==== Запуск Tauri ====
//     tauri::Builder::default()
//         .plugin(tauri_plugin_http::init())
//         .plugin(tauri_plugin_dialog::init())
//         .plugin(tauri_plugin_fs::init())
//         .setup(|app| {
//             // Запускаем сервер при старте Tauri
//             adb_server::start();
            
//             println!("ADB Server начал работу");

            
//             Ok(())
//         })
        
//         .invoke_handler(tauri::generate_handler![fetch_reports])
//         .run(tauri::generate_context!())
     
//         .expect("error while running tauri app");


        
// }

pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())

        .setup(|_app| {
            adb_server::start();
            println!("[ADB] Server started");
            Ok(())
        })

        .invoke_handler(tauri::generate_handler![fetch_reports])

        // 🔥 ВАЖНО: build(), а не run()
        .build(tauri::generate_context!())
        .expect("error while building tauri app");

    // 🔥 ВОТ ЗДЕСЬ обработка ExitRequested
    app.run(|_app_handle, event| {
        if let tauri::RunEvent::ExitRequested { .. } = event {
            println!("[TAURI] Exit requested, stopping ADB server...");
            adb_server::stop_server();
        }
    });
}



pub mod adb_server;




