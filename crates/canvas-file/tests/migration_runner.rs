use std::fs;

use canvas_file::migrations::{migrate_canvas_json, MigrationError};
use canvas_file::CanvasSchemaVersion;
use serde_json::Value;

fn load(name: &str) -> Value {
    let path = format!("{}/../../tests/fixtures/canvas/migrations/{name}", env!("CARGO_MANIFEST_DIR"));
    serde_json::from_str(&fs::read_to_string(path).expect(name)).expect(name)
}

#[test]
fn migration_runner() {
    let migrated = migrate_canvas_json(load("v0_draft_document.canvas.json"), CanvasSchemaVersion::V1).expect("draft");
    assert_eq!(migrated.report.source_version, "v0");
    assert_eq!(migrated.report.target_version, "v1");
    assert!(!migrated.report.warnings().is_empty());
    let future = serde_json::json!({ "schema_version": 9, "document_id": "future" });
    assert_eq!(
        migrate_canvas_json(future, CanvasSchemaVersion::V1).unwrap_err(),
        MigrationError::UnsupportedTargetVersion
    );
}

#[test]
fn migration_fixture_suite() {
    let draft = migrate_canvas_json(load("v0_draft_document.canvas.json"), CanvasSchemaVersion::V1).expect("draft");
    assert_eq!(draft.output_document["schema_version"], 1);
    let passthrough = migrate_canvas_json(load("v1_passthrough.canvas.json"), CanvasSchemaVersion::V1).expect("v1");
    assert_eq!(passthrough.output_document["schema_version"], 1);
    let effect = migrate_canvas_json(load("unsupported_legacy_effect.canvas.json"), CanvasSchemaVersion::V1).expect("effect");
    let report = &effect.report.unsupported_elements[0];
    assert!(report.recoverable);
    assert_eq!(report.json_pointer, "/unsupported_elements/0/raw");
    assert_eq!(effect.output_document["unsupported_elements"][0]["raw"]["type"], "glow");
}
