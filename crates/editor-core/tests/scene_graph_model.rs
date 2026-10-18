use std::fs;

use editor_core::scene_graph::{Bounds, CanvasDocument, SceneNode, SceneNodeKind, Transform};

#[test]
fn scene_graph_model_defaults_and_bounds() {
    let document = CanvasDocument::new("doc-empty");
    assert_eq!(document.schema_version, 1);
    assert!(document.pages.is_empty());
    let page = SceneNode::page("page-1", "Cover");
    assert_eq!(page.kind(), SceneNodeKind::Page);
    let encoded = serde_json::to_string(&Transform::identity()).expect("transform");
    assert!(encoded.contains("\"scale_x\":1.0") || encoded.contains("\"scale_x\":1"));
    let bounds = serde_json::to_string(&Bounds::zero()).expect("bounds");
    let decoded: Bounds = serde_json::from_str(&bounds).expect("bounds roundtrip");
    assert_eq!(decoded, Bounds::zero());
}

#[test]
fn document_roundtrip_fixture() {
    let path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/canvas/v1/semantic_scene_graph.canvas.json"
    );
    let raw = fs::read_to_string(path).expect("fixture");
    let document = CanvasDocument::from_json(&raw).expect("deserialize");
    assert_eq!(document.schema_version, 1);
    assert!(!document.pages.is_empty());
    assert!(!document.tokens.is_empty());
    assert!(!document.components.is_empty());
    let again = serde_json::to_string(&document).expect("serialize");
    let roundtrip = CanvasDocument::from_json(&again).expect("roundtrip");
    assert_eq!(roundtrip.schema_version, 1);
    assert!(!raw.contains("\"cursor\""));
    assert!(!raw.contains("\"selection\""));
    assert!(!raw.contains("\"viewport\""));
    assert!(!raw.contains("\"active_tool\""));
    assert!(!raw.contains("\"user_color\""));
}
