// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//   tauri::Builder::default()
//   .plugin(tauri::plugin::TauriPlugin::new("fs")) 
//   .invoke_handler(|_app, _window, cmd| {
//       tauri::generate_handler![list_reports](cmd)
//   })
//     .setup(|app| {
//       if cfg!(debug_assertions) {
//         app.handle().plugin(
//           tauri_plugin_log::Builder::default()
//             .level(log::LevelFilter::Info)
//             .build(),
//         )?;
//       }
//       Ok(())
//     })
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }


// const REPORTS_DIR: &str = "D:/records-dev"; // поменяй путь 

use std::fs;
use std::path::PathBuf;

const REPORTS_DIR: &str = "D:/records-dev";

#[derive(serde::Serialize)]
struct ReportMeta {
    filename: String,
    docId: String,
    Name: String,
    Batch: String,
    StartDate: String,
    EndDate: String,
}

#[tauri::command]
fn list_reports() -> Vec<ReportMeta> {
    let mut result = Vec::new();

    if let Ok(entries) = fs::read_dir(REPORTS_DIR) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().map(|ext| ext == "json").unwrap_or(false) {
                if let Ok(content) = fs::read_to_string(&path) {
                    if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
                        result.push(ReportMeta {
                            filename: path.file_name().unwrap().to_string_lossy().to_string(),
                            docId: json["docId"].as_str().unwrap_or("").to_string(),
                            Name: json["Name"].as_str().unwrap_or("").to_string(),
                            Batch: json["Batch"].as_str().unwrap_or("").to_string(),
                            StartDate: json["StartDate"].as_str().unwrap_or("").to_string(),
                            EndDate: json["EndDate"].as_str().unwrap_or("").to_string(),
                        });
                    }
                }
            }
        }
    }

    result
}

#[tauri::command]
fn read_report(filename: String) -> Option<serde_json::Value> {
    let path = PathBuf::from(REPORTS_DIR).join(&filename);
    if path.exists() {
        if let Ok(content) = fs::read_to_string(&path) {
            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
                return Some(json);
            }
        }
    }
    None
}

#[tauri::command]
fn delete_report(filename: String) -> bool {
    let path = PathBuf::from(REPORTS_DIR).join(&filename);
    if path.exists() {
        return fs::remove_file(path).is_ok();
    }
    false
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_reports,
            read_report,
            delete_report
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}


