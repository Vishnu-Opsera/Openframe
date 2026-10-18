pub mod render_adapter;
pub mod render_tree;
pub mod scene_graph;
pub mod transactions;
pub mod wasm;

use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct EditorCoreInfo {
    pub version: String,
    pub capabilities: Vec<String>,
    pub renderer_boundary: String,
}

pub fn editor_core_metadata() -> EditorCoreInfo {
    EditorCoreInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        capabilities: vec!["status".to_string()],
        renderer_boundary: "external".to_string(),
    }
}

#[wasm_bindgen(js_name = init_editor_core)]
pub fn init_editor_core() -> Result<JsValue, JsValue> {
    serde_wasm_bindgen::to_value(&editor_core_metadata()).map_err(|error| JsValue::from_str(&error.to_string()))
}

#[cfg(test)]
mod tests {
    use super::editor_core_metadata;

    #[test]
    fn init_editor_core_exports_version_and_capabilities() {
        let info = editor_core_metadata();
        assert_eq!(info.version, "0.1.0");
        assert!(info.capabilities.contains(&"status".to_string()));
        assert_eq!(info.renderer_boundary, "external");
    }
}
