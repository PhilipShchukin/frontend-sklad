
use axum::{
  extract::Path,
  routing::{delete, get, post},
  Json, Router,
};
use serde::{Deserialize, Serialize};
use crate::adb_server::adb;

#[derive(Deserialize)]
struct PushTaskBody {
  task: serde_json::Value,
}

#[derive(Deserialize)]
struct BackupFileBody {
  local_path: Option<String>,
}

#[derive(Serialize)]
struct ApiResponse<T> {
  ok: bool,
  body: T,
}

#[derive(Serialize)]
struct CheckAdbResponse {
  found: bool,
  device_id: Option<String>,
}

#[derive(Serialize)]
struct FileListResponse {
  files: Vec<String>,
}

#[derive(Serialize)]
struct FileInfoResponse {
  exists: bool,
  size: u64,
  modified: String,
}

#[derive(Serialize)]
struct FolderCheckResponse {
  exists: bool,
  file_count: usize,
  sample_files: Vec<String>,
  error: Option<String>,
}

#[derive(Serialize)]
struct DeviceInfoResponse {
  model: Option<String>,
  android_version: Option<String>,
  serial: Option<String>,
}

#[derive(Serialize)]
struct StorageInfoResponse {
  total: String,
  used: String,
  free: String,
}

#[derive(Serialize)]
struct BackupResponse {
  local_path: String,
}

#[derive(Serialize)]
struct DeleteResponse {
  success: bool,
  message: Option<String>,
}

pub fn router() -> Router {
  Router::new()
      .route("/health", get(health))
      .route("/ping-backend", get(ping_backend))
      .route("/adb/push-task", post(push_task))
      .route("/adb/check", get(check_adb))
      .route("/adb/files", get(get_files))
      .route("/adb/folder-check", get(check_folder))
      .route("/adb/file-info/:filename", get(get_file_info_handler))
      .route("/adb/read/:filename", get(read_file_handler))
      .route("/adb/backup/:filename", post(backup_file_handler))
      .route("/adb/delete/:filename", delete(delete_file_handler))
      .route("/adb/version", get(get_adb_version_handler))
      .route("/adb/device-info", get(get_device_info_handler))
      .route("/adb/storage", get(get_storage_handler))
}

async fn health() -> Json<ApiResponse<&'static str>> {
  Json(ApiResponse { ok: true, body: "ADB Agent OK" })
}

async fn ping_backend() -> Json<ApiResponse<&'static str>> {
  Json(ApiResponse { ok: true, body: "Backend OK" })
}

async fn push_task(Json(payload): Json<PushTaskBody>) -> Json<ApiResponse<serde_json::Value>> {
  adb::handle_push_task(payload.task).await;
  Json(ApiResponse { ok: true, body: serde_json::json!({"status": "task received"}) })
}

async fn check_adb() -> Json<CheckAdbResponse> {
  let result = adb::check_device();
  Json(CheckAdbResponse {
      found: result.found,
      device_id: result.device_id,
  })
}

async fn get_files() -> Json<ApiResponse<FileListResponse>> {
  match adb::get_file_list() {
      Ok(files) => Json(ApiResponse {
          ok: true,
          body: FileListResponse { files },
      }),
      Err(_err) => Json(ApiResponse {
          ok: false,
          body: FileListResponse { files: Vec::new() },
      }),
  }
}

async fn check_folder() -> Json<ApiResponse<FolderCheckResponse>> {
  let result = adb::check_warehouse_folder();
  Json(ApiResponse {
      ok: result.error.is_none(),
      body: FolderCheckResponse {
          exists: result.exists,
          file_count: result.file_count,
          sample_files: result.sample_files,
          error: result.error,
      },
  })
}

async fn get_file_info_handler(Path(filename): Path<String>) -> Json<ApiResponse<FileInfoResponse>> {
  let info = adb::get_file_info(&filename);
  Json(ApiResponse {
      ok: info.exists,
      body: FileInfoResponse {
          exists: info.exists,
          size: info.size,
          modified: info.modified,
      },
  })
}

async fn read_file_handler(Path(filename): Path<String>) -> Json<ApiResponse<String>> {
  match adb::read_file(&filename) {
      Ok(content) => Json(ApiResponse {
          ok: true,
          body: content,
      }),
      Err(err) => Json(ApiResponse {
          ok: false,
          body: err,
      }),
  }
}

async fn backup_file_handler(
  Path(filename): Path<String>,
  Json(payload): Json<BackupFileBody>,
) -> Json<ApiResponse<BackupResponse>> {
  let local_path = payload.local_path.unwrap_or_default();
  
  match adb::backup_file(&filename, &local_path) {
      Ok(path) => Json(ApiResponse {
          ok: true,
          body: BackupResponse { local_path: path },
      }),
      Err(err) => Json(ApiResponse {
          ok: false,
          body: BackupResponse { local_path: err },
      }),
  }
}

async fn delete_file_handler(Path(filename): Path<String>) -> Json<ApiResponse<DeleteResponse>> {
  match adb::delete_file(&filename) {
      Ok(_) => Json(ApiResponse {
          ok: true,
          body: DeleteResponse {
              success: true,
              message: None,
          },
      }),
      Err(err) => Json(ApiResponse {
          ok: false,
          body: DeleteResponse {
              success: false,
              message: Some(err),
          },
      }),
  }
}

async fn get_adb_version_handler() -> Json<ApiResponse<String>> {
  let version = adb::get_adb_version();
  Json(ApiResponse {
      ok: !version.contains("не доступен"),
      body: version,
  })
}

async fn get_device_info_handler() -> Json<ApiResponse<DeviceInfoResponse>> {
  let info = adb::get_device_info();
  Json(ApiResponse {
      ok: true,
      body: DeviceInfoResponse {
          model: info.model,
          android_version: info.android_version,
          serial: info.serial,
      },
  })
}

async fn get_storage_handler() -> Json<ApiResponse<StorageInfoResponse>> {
  let info = adb::check_storage();
  Json(ApiResponse {
      ok: true,
      body: StorageInfoResponse {
          total: info.total,
          used: info.used,
          free: info.free,
      },
  })
}



