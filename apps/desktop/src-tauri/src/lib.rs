use tauri_plugin_store::StoreExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // 앱 시작 시 store 초기화
            let _store = app.store("ringtalk.json")?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("링톡 데스크톱 앱 실행 오류");
}
