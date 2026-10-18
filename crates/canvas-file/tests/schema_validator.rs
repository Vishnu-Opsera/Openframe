use std::fs;

use canvas_file::{validate_canvas_file_version, validate_canvas_json, CanvasSchemaVersion};
use serde_json::Value;

fn load(name: &str) -> Value {
    let path = format!(
        "{}/../../tests/fixtures/canvas/v1/{name}",
        env!("CARGO_MANIFEST_DIR")
    );
    serde_json::from_str(&fs::read_to_string(path).expect(name)).expect(name)
}

#[test]
fn schema_validator_routes_version_and_reports_paths() {
    let missing = load("invalid_missing_schema_version.canvas.json");
    let error = validate_canvas_json(&missing).expect_err("missing version");
    assert_eq!(error.errors[0].json_pointer, "/schema_version");
    let future = serde_json::json!({
        "schema_version": 9,
        "document_id": "doc",
        "pages": [],
        "nodes": [],
        "tokens": [],
        "components": [],
        "export_metadata": {},
        "unsupported_elements": []
    });
    let unsupported = validate_canvas_file_version(&future).expect_err("future");
    assert_eq!(unsupported.errors[0].code, "unsupported_schema_version");
    assert_eq!(validate_canvas_file_version(&load("valid_minimal.canvas.json")).unwrap(), CanvasSchemaVersion::V1);
}

#[test]
fn schema_fixture_suite() {
    let minimal = validate_canvas_json(&load("valid_minimal.canvas.json")).expect("minimal");
    assert!(minimal.valid);
    let representative = validate_canvas_json(&load("semantic_scene_graph.canvas.json")).expect("scene");
    assert!(representative.valid);
    let recoverable = validate_canvas_json(&load("unsupported_element_recoverable.canvas.json")).expect("recoverable");
    assert!(recoverable.valid);
    let kind = validate_canvas_json(&load("invalid_node_kind.canvas.json")).expect_err("kind");
    assert!(kind.errors.iter().any(|error| error.code == "schema_violation"));
}
