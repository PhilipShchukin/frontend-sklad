pub mod routes;
pub mod adb;

use axum::Router;
use tower_http::cors::CorsLayer;
use tokio::net::TcpListener;
use std::net::SocketAddr;


use std::sync::Mutex;
use tokio::sync::oneshot;
use once_cell::sync::OnceCell;


use once_cell::sync::Lazy;
use std::sync::atomic::{AtomicBool, Ordering};

static SERVER_RUNNING: Lazy<AtomicBool> =
    Lazy::new(|| AtomicBool::new(false));


static SHUTDOWN_TX: Lazy<Mutex<Option<oneshot::Sender<()>>>> =
    Lazy::new(|| Mutex::new(None));



pub async fn start_server(
    shutdown: oneshot::Receiver<()>,
) -> Result<(), Box<dyn std::error::Error>> {
    let app: Router = routes::router().layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([127, 0, 0, 1], 8765));
    // let addr = SocketAddr::from(([0, 0, 0, 0], 8765));
    // let addr = SocketAddr::from(([172, 16, 16, 138], 8765));
    let listener = TcpListener::bind(addr).await?;

    println!("[ADB] Server running on http://{}", addr);

    axum::serve(listener, app)
        .with_graceful_shutdown(async {
            shutdown.await.ok();
            println!("[ADB] Shutdown signal received");
        })
        .await?;

    Ok(())
}

// pub async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
//     let app: Router = routes::router().layer(CorsLayer::permissive());
//     let addr = SocketAddr::from(([127, 0, 0, 1], 8765));
//     // let addr = SocketAddr::from(([0, 0, 0, 0], 8765));

//     // let addr = [
//     //     SocketAddr::from(([127, 0, 0, 1], 4545)),
//     //     SocketAddr::from(([0, 0, 0, 0], 4545)),  // Все интерфейсы
//     //     SocketAddr::from(([172, 16, 16, 138], 4545)), // Ваш локальный IP
//     // ];

//     let listener = TcpListener::bind(addr).await?;
//     println!("[ADB] Server running on http://{}", addr);

//     axum::serve(listener, app).await?;
//     Ok(())
// }


// pub fn start() {
//     std::thread::spawn(|| {
//         let rt = tokio::runtime::Runtime::new().unwrap();
//         rt.block_on(async {
//             if let Err(e) = start_server().await {
//                 eprintln!("[ADB] Server error: {}", e);
//             }
//         });
//     });
// }

// pub fn start() {
//     let (tx, rx) = oneshot::channel();

//     SHUTDOWN_TX
//         .set(Mutex::new(Some(tx)))
//         .expect("Shutdown channel already set");

//     std::thread::spawn(|| {
//         let rt = tokio::runtime::Runtime::new().unwrap();
//         rt.block_on(async {
//             if let Err(e) = start_server(rx).await {
//                 eprintln!("[ADB] Server error: {}", e);
//             }
//         });
//     });
// }

// pub fn stop_server() {
//     if let Some(lock) = SHUTDOWN_TX.get() {
//         if let Some(tx) = lock.lock().unwrap().take() {
//             let _ = tx.send(());
//             println!("[ADB] Shutdown signal sent");
//         }
//     }
// }
pub fn start() {
    if SERVER_RUNNING.swap(true, Ordering::SeqCst) {
        println!("[ADB] Server already running, skip start");
        return;
    }

    let (tx, rx) = oneshot::channel();
    *SHUTDOWN_TX.lock().unwrap() = Some(tx);

    std::thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();
        if let Err(e) = rt.block_on(start_server(rx)) {
            eprintln!("[ADB] Server error: {}", e);
        }
    });
}


pub fn stop_server() {
    if let Some(tx) = SHUTDOWN_TX.lock().unwrap().take() {
        let _ = tx.send(());
        SERVER_RUNNING.store(false, Ordering::SeqCst);
        println!("[ADB] Shutdown signal sent");
    }
}


