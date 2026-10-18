use serde::Serialize;
use wasm_bindgen::prelude::*;

use crate::render_tree::RenderDeltaBatch;

#[derive(Debug, Serialize)]
struct WasmRenderDelta {
    node_id: String,
    material_key: String,
    opacity: f64,
    bounds_width: f64,
    clip: Option<String>,
}

pub fn serialize_render_delta_batch(batch: &RenderDeltaBatch) -> Result<String, String> {
    let records: Vec<WasmRenderDelta> = batch
        .deltas
        .iter()
        .filter_map(|delta| match delta {
            crate::render_tree::RenderDelta::Insert(primitive) | crate::render_tree::RenderDelta::Update(primitive) => {
                Some(WasmRenderDelta {
                    node_id: primitive.node_id.clone(),
                    material_key: primitive.material_key.clone(),
                    opacity: primitive.opacity,
                    bounds_width: primitive.bounds.width,
                    clip: primitive.clip.clone(),
                })
            }
            crate::render_tree::RenderDelta::Delete { node_id } => Some(WasmRenderDelta {
                node_id: node_id.clone(),
                material_key: String::new(),
                opacity: 0.0,
                bounds_width: 0.0,
                clip: None,
            }),
            crate::render_tree::RenderDelta::FullRebuild => None,
        })
        .collect();
    serde_json::to_string(&records).map_err(|error| error.to_string())
}

#[wasm_bindgen(js_name = serialize_render_deltas)]
pub fn serialize_render_deltas(batch_json: &str) -> Result<String, JsValue> {
    let batch: RenderDeltaBatch = serde_json::from_str(batch_json).map_err(|error| JsValue::from_str(&error.to_string()))?;
    serialize_render_delta_batch(&batch).map_err(|error| JsValue::from_str(&error))
}
