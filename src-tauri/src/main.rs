// Magic Cursor - Tauri Desktop Application
// Main entry point for the desktop app

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{error, info};
use tauri::Manager;

fn main() {
    // Initialize logger
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .format_timestamp_millis()
        .init();

    info!("Starting Magic Cursor v{}", env!("CARGO_PKG_VERSION"));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Magic Cursor - Fluid Mouse Trail").unwrap();
            window.center().unwrap();
            
            info!("Magic Cursor window initialized successfully");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            magic_cursor_lib::commands::greet,
            magic_cursor_lib::commands::get_default_settings,
            magic_cursor_lib::commands::get_app_version,
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            error!("Error while running Magic Cursor: {}", e);
            std::process::exit(1);
        });
}