use editor_core::render_adapter::build_render_deltas;
use editor_core::render_tree::{RenderBounds, RenderDelta, RenderDeltaBatch, RenderPrimitive, RenderTreeState};
use editor_core::scene_graph::{hierarchy::node, CanvasDocument, SceneGraph, SceneNodeKind, Transform};
use editor_core::wasm::serialize_render_delta_batch;

#[test]
fn render_adapter_wasm_boundary() {
    let mut graph = SceneGraph::new(CanvasDocument::new("doc-wasm"));
    graph.insert_child(None, node("frame-1", SceneNodeKind::Frame, "Frame"), 0).unwrap();
    let batch = build_render_deltas(&graph, &RenderTreeState::empty()).unwrap();
    let encoded = serialize_render_delta_batch(&batch).expect("serialize");
    assert!(encoded.contains("frame-1"));
    assert!(encoded.contains("material_key"));
    assert!(encoded.contains("opacity"));
    assert!(encoded.contains("bounds_width"));
    let manual = RenderDeltaBatch {
        deltas: vec![RenderDelta::Insert(Box::new(RenderPrimitive {
            node_id: "clip-1".to_string(),
            material_key: "ink".to_string(),
            opacity: 0.8,
            transform: Transform::identity(),
            bounds: RenderBounds { x: 0.0, y: 0.0, width: 4.0, height: 4.0 },
            clip: Some("page-1".to_string()),
            z_order: 0,
        }))],
    };
    let encoded_clip = serialize_render_delta_batch(&manual).unwrap();
    assert!(encoded_clip.contains("clip-1"));
    assert!(encoded_clip.contains("page-1"));
}
