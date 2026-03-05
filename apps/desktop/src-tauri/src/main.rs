// Tauri가 Windows에서 콘솔 창을 표시하지 않도록 함
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}
