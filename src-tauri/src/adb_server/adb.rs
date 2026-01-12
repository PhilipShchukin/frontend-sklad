
use serde::Serialize;
use serde_json::Value;
use chrono::{TimeZone, Utc};
use std::fs;
use std::path::PathBuf;
use std::process::Command;

pub struct AdbCheckResult {
    pub found: bool,
    pub device_id: Option<String>,
}

#[derive(Serialize)]
pub struct FileInfo {
    pub exists: bool,
    pub size: u64,
    pub modified: String,
}

#[derive(Serialize)]
pub struct FolderCheckResult {
    pub exists: bool,
    pub file_count: usize,
    pub sample_files: Vec<String>,
    pub error: Option<String>,
}

#[derive(Serialize)]
pub struct DeviceInfo {
    pub model: Option<String>,
    pub android_version: Option<String>,
    pub serial: Option<String>,
}

#[derive(Serialize)]
pub struct StorageInfo {
    pub total: String,
    pub used: String,
    pub free: String,
}



const ADB_PATH: &str = "C:\\platform-tools-latest-windows\\platform-tools\\adb.exe";
const WAREHOUSE_PATH: &str = "/storage/emulated/0/Documents/warehouse";

pub async fn handle_push_task(task: Value) -> Result<String, String> {
    use std::process::Command;
    use std::time::{SystemTime, UNIX_EPOCH};
    
    println!("[ADB] Processing push task to device");
    
    // 1. Проверяем подключение устройства
    let check_result = check_device();
    if !check_result.found {
        return Err("No ADB device found or not in device mode".to_string());
    }
    
    // 2. Генерируем имя файла (как в оригинале - с миллисекундами)
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    
    let filename = format!("task-{}.json", timestamp);
    println!("[ADB] Generated filename: {}", filename);
    
    // 3. Создаем временный файл на компьютере
    let temp_dir = PathBuf::from("temp_adb");
    if !temp_dir.exists() {
        fs::create_dir_all(&temp_dir)
            .map_err(|e| format!("Failed to create temp directory: {}", e))?;
    }
    
    let local_file = temp_dir.join(&filename);
    println!("[ADB] Temporary file: {}", local_file.display());
    
    // 4. Сохраняем JSON во временный файл
    let json_string = serde_json::to_string(&task)
        .map_err(|e| format!("Failed to serialize JSON: {}", e))?;
    
    fs::write(&local_file, json_string)
        .map_err(|e| format!("Failed to write temp file: {}", e))?;
    
    println!("[ADB] JSON saved to temp file ({} bytes)", local_file.metadata().map(|m| m.len()).unwrap_or(0));
    
    // 5. Отправляем файл на устройство
    let device_path = format!("{}/{}", WAREHOUSE_PATH, filename);
    println!("[ADB] Pushing to device: {} -> {}", local_file.display(), device_path);
    
    // Выполняем adb push
    let output = Command::new(ADB_PATH)
        .arg("push")
        .arg(local_file.to_string_lossy().to_string())
        .arg(&device_path)
        .output()
        .map_err(|e| format!("Failed to execute ADB: {}", e))?;
    
    // 6. Логируем результат
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    
    if !stdout.trim().is_empty() {
        println!("[ADB] ADB output: {}", stdout);
    }
    
    if !stderr.trim().is_empty() {
        println!("[ADB] ADB error: {}", stderr);
    }
    
    // 7. Удаляем временный файл
    let _ = fs::remove_file(&local_file);
    
    // 8. Проверяем успешность
    if output.status.success() {
        println!("[ADB] Task successfully pushed to device: {}", device_path);
        
        // Проверяем, что файл действительно создан на устройстве
        let check_cmd = Command::new(ADB_PATH)
            .args(&["shell", &format!("ls {}", device_path)])
            .output();
        
        match check_cmd {
            Ok(check_output) => {
                let check_stdout = String::from_utf8_lossy(&check_output.stdout);
                if check_stdout.contains(&filename) {
                    println!("[ADB] File confirmed on device: {}", check_stdout.trim());
                } else {
                    println!("[ADB] Warning: File check on device returned: {}", check_stdout);
                }
            }
            Err(e) => {
                println!("[ADB] Warning: Could not verify file on device: {}", e);
            }
        }
        
        Ok(format!("Task saved to device: {}", device_path))
    } else {
        Err(format!("ADB push failed: {}", stderr))
    }
}
// pub async fn handle_push_task(task: Value) {
//     println!("[ADB] received task: {}", task);
//     let dir = PathBuf::from("adb_tasks");

//     if !dir.exists() {
//         fs::create_dir_all(&dir).unwrap();
//     }

//     let filename = format!("task-{}.json", Utc::now().timestamp());
//     let path = dir.join(filename);
//     println!("[ADB] received task: {}", dir.display());

//     fs::write(path, task.to_string()).unwrap();

//     println!("[ADB] task saved");
// }

pub fn check_device() -> AdbCheckResult {
    
    let output = Command::new(ADB_PATH).arg("devices").output();

    let output = match output {
        Ok(o) => o,
        Err(_) => {
            return AdbCheckResult {
                found: false,
                device_id: None,
            };
        }
    };

    let stdout = String::from_utf8_lossy(&output.stdout);

    for line in stdout.lines().skip(1) {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }

        let parts: Vec<&str> = line.split('\t').collect();
        if parts.len() >= 2 && parts[1] == "device" {
            return AdbCheckResult {
                found: true,
                device_id: Some(parts[0].to_string()),
            };
        }
    }

    AdbCheckResult {
        found: false,
        device_id: None,
    }
}

pub fn get_file_list() -> Result<Vec<String>, String> {
    let output = Command::new(ADB_PATH)
        .args(&[
            "shell",
            &format!("find {} -name '*.json' -type f", WAREHOUSE_PATH),
        ])
        .output()
        .map_err(|e| format!("Failed to execute ADB: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut files = Vec::new();

    for line in stdout.lines() {
        let line = line.trim();
        if line.is_empty() || line.contains("No such file") || line.starts_with("find:") {
            continue;
        }

        if line.contains(".json") {
            if let Some(filename) = line.split('/').last() {
                if filename.ends_with(".json") {
                    files.push(filename.to_string());
                }
            }
        }
    }

    Ok(files)
}

pub fn check_warehouse_folder() -> FolderCheckResult {
    // Проверяем существование папки
    let folder_check = Command::new(ADB_PATH)
        .args(&[
            "shell",
            &format!("if [ -d {} ]; then echo 'EXISTS'; else echo 'NOT_EXISTS'; fi", WAREHOUSE_PATH),
        ])
        .output();

    match folder_check {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let folder_exists = stdout.trim() == "EXISTS";

            if !folder_exists {
                return FolderCheckResult {
                    exists: false,
                    file_count: 0,
                    sample_files: Vec::new(),
                    error: Some(format!("Папка {} не существует", WAREHOUSE_PATH)),
                };
            }

            // Получаем список файлов
            match get_file_list() {
                Ok(files) => FolderCheckResult {
                    exists: true,
                    file_count: files.len(),
                    sample_files: files.into_iter().take(5).collect(),
                    error: None,
                },
                Err(err) => FolderCheckResult {
                    exists: true,
                    file_count: 0,
                    sample_files: Vec::new(),
                    error: Some(err),
                },
            }
        }
        Err(err) => FolderCheckResult {
            exists: false,
            file_count: 0,
            sample_files: Vec::new(),
            error: Some(format!("Failed to check folder: {}", err)),
        },
    }
}

pub fn get_file_info(filename: &str) -> FileInfo {
    let file_path = format!("{}/{}", WAREHOUSE_PATH, filename);
    
    let output = Command::new(ADB_PATH)
        .args(&["shell", &format!("stat -c '%s %Y' {} 2>/dev/null || echo '0 0'", file_path)])
        .output();

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let parts: Vec<&str> = stdout.trim().split_whitespace().collect();
            
            if parts.len() >= 2 {
                let size: u64 = parts[0].parse().unwrap_or(0);
                let timestamp: i64 = parts[1].parse().unwrap_or(0);
                
                let modified = if timestamp > 0 {
                    if let Some(dt) = Utc.timestamp_opt(timestamp, 0).single() {
                        dt.to_rfc3339()
                    } else {
                        String::new()
                    }
                } else {
                    String::new()
                };
                
                FileInfo {
                    exists: size > 0,
                    size,
                    modified,
                }
            } else {
                FileInfo {
                    exists: false,
                    size: 0,
                    modified: String::new(),
                }
            }
        }
        Err(_) => FileInfo {
            exists: false,
            size: 0,
            modified: String::new(),
        },
    }
}

pub fn read_file(filename: &str) -> Result<String, String> {
    let file_path = format!("{}/{}", WAREHOUSE_PATH, filename);
    
    let output = Command::new(ADB_PATH)
        .args(&["shell", &format!("cat {}", file_path)])
        .output()
        .map_err(|e| format!("Failed to execute ADB: {}", e))?;
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    
    if stdout.trim().is_empty() {
        return Err(format!("Файл {} пустой или недоступен", filename));
    }
    
    Ok(stdout.to_string())
}

pub fn backup_file(filename: &str, local_path: &str) -> Result<String, String> {
    let file_path = format!("{}/{}", WAREHOUSE_PATH, filename);
    let local_path = if local_path.is_empty() {
        format!("./backup/{}", filename)
    } else {
        local_path.to_string()
    };
    
    // Создаем директорию если нужно
    if let Some(parent) = PathBuf::from(&local_path).parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    
    Command::new(ADB_PATH)
        .args(&["pull", &file_path, &local_path])
        .output()
        .map_err(|e| format!("Failed to execute ADB pull: {}", e))?;
    
    Ok(local_path)
}

pub fn delete_file(filename: &str) -> Result<bool, String> {
    let file_path = format!("{}/{}", WAREHOUSE_PATH, filename);
    
    let output = Command::new(ADB_PATH)
        .args(&["shell", &format!("rm {}", file_path)])
        .output()
        .map_err(|e| format!("Failed to execute ADB: {}", e))?;
    
    let stderr = String::from_utf8_lossy(&output.stderr);
    
    if !stderr.trim().is_empty() {
        return Err(stderr.to_string());
    }
    
    Ok(true)
}

pub fn get_adb_version() -> String {
    match Command::new(ADB_PATH).arg("version").output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            stdout.lines().next().unwrap_or("Unknown").to_string()
        }
        Err(_) => "ADB не доступен".to_string(),
    }
}

pub fn get_device_info() -> DeviceInfo {
    let get_prop = |prop: &str| -> Option<String> {
        Command::new(ADB_PATH)
            .args(&["shell", &format!("getprop {}", prop)])
            .output()
            .ok()
            .and_then(|output| {
                let stdout = String::from_utf8_lossy(&output.stdout);
                let trimmed = stdout.trim();
                if !trimmed.is_empty() {
                    Some(trimmed.to_string())
                } else {
                    None
                }
            })
    };
    
    DeviceInfo {
        model: get_prop("ro.product.model"),
        android_version: get_prop("ro.build.version.release"),
        serial: get_prop("ro.serialno"),
    }
}

pub fn check_storage() -> StorageInfo {
    let output = Command::new(ADB_PATH)
        .args(&["shell", "df /storage/emulated/0"])
        .output();
    
    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let lines: Vec<&str> = stdout.lines().collect();
            
            if lines.len() > 1 {
                let parts: Vec<&str> = lines[1].split_whitespace().collect();
                if parts.len() >= 5 {
                    let total_kb = parts[1].parse::<u64>().unwrap_or(0);
                    let used_kb = parts[2].parse::<u64>().unwrap_or(0);
                    let free_kb = parts[3].parse::<u64>().unwrap_or(0);
                    
                    return StorageInfo {
                        total: format_bytes(total_kb * 1024),
                        used: format_bytes(used_kb * 1024),
                        free: format_bytes(free_kb * 1024),
                    };
                }
            }
            
            StorageInfo {
                total: "0".to_string(),
                used: "0".to_string(),
                free: "0".to_string(),
            }
        }
        Err(_) => StorageInfo {
            total: "0".to_string(),
            used: "0".to_string(),
            free: "0".to_string(),
        },
    }
}

fn format_bytes(bytes: u64) -> String {
    const K: f64 = 1024.0;
    const SIZES: [&str; 4] = ["Bytes", "KB", "MB", "GB"];
    
    if bytes == 0 {
        return "0 Bytes".to_string();
    }
    
    let i = (bytes as f64).log(K).floor() as usize;
    let size = bytes as f64 / K.powi(i as i32);
    
    format!("{:.2} {}", size, SIZES[i.min(3)])
}