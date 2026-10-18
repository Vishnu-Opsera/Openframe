use serde::Serialize;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct RuntimeInfo {
    pub runtime: String,
    pub os: String,
    pub arch: String,
    pub app_version: String,
    pub tauri_major_version: u32,
}

#[tauri::command]
pub fn get_runtime_info() -> Result<RuntimeInfo, String> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    if os.is_empty() || arch.is_empty() {
        return Err("runtime information is unavailable".to_string());
    }

    Ok(RuntimeInfo {
        runtime: "tauri".to_string(),
        os: os.to_string(),
        arch: arch.to_string(),
        app_version: env!("CARGO_PKG_VERSION").to_string(),
        tauri_major_version: 2,
    })
}

#[cfg(test)]
mod tests {
    use super::get_runtime_info;

    #[test]
    fn runtime_info_identifies_tauri_major_version_two() {
        let info = get_runtime_info().expect("runtime info");
        assert_eq!(info.runtime, "tauri");
        assert_eq!(info.tauri_major_version, 2);
        assert!(!info.os.is_empty());
        assert!(!info.arch.is_empty());
        assert_eq!(info.app_version, "0.1.0");
    }
}
