mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::get_runtime_info])
        .run(tauri::generate_context!())
        .map_err(|error| error.to_string())
        .expect("Openframe desktop shell failed to start");
}
