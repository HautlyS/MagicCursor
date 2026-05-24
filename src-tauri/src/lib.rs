// Magic Cursor - Tauri Desktop Application Library
// Provides GPU-accelerated fluid cursor trail functionality

use serde::{Deserialize, Serialize};

/// Cursor settings that can be synced across devices
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CursorSettings {
    pub enabled: bool,
    pub sim_resolution: u32,
    pub dye_resolution: u32,
    pub density_dissipation: f32,
    pub velocity_dissipation: f32,
    pub pressure: f32,
    pub pressure_iterations: u32,
    pub curl: f32,
    pub splat_radius: f32,
    pub splat_force: f32,
    pub shading: bool,
    pub color_update_speed: u32,
    pub transparent: bool,
}

impl Default for CursorSettings {
    fn default() -> Self {
        Self {
            enabled: true,
            sim_resolution: 128,
            dye_resolution: 1024,
            density_dissipation: 3.5,
            velocity_dissipation: 2.0,
            pressure: 0.1,
            pressure_iterations: 20,
            curl: 3.0,
            splat_radius: 0.2,
            splat_force: 6000.0,
            shading: true,
            color_update_speed: 10,
            transparent: true,
        }
    }
}

/// Tauri commands for the Magic Cursor app
pub mod commands {
    use super::*;

    #[tauri::command]
    pub fn get_default_settings() -> CursorSettings {
        CursorSettings::default()
    }

    #[tauri::command]
    pub fn greet(name: &str) -> String {
        format!("Hello, {}! Welcome to Magic Cursor.", name)
    }

    #[tauri::command]
    pub fn get_app_version() -> String {
        env!("CARGO_PKG_VERSION").to_string()
    }
}