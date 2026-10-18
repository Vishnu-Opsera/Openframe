pub mod v0_to_v1;

use serde_json::{json, Value};

use crate::validator::{validate_canvas_json, CanvasSchemaVersion};

#[derive(Debug, Clone, PartialEq)]
pub struct MigrationWarning {
    pub message: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UnsupportedElementReport {
    pub recoverable: bool,
    pub json_pointer: String,
    pub raw: Value,
}

#[derive(Debug, Clone, PartialEq)]
pub struct MigrationReport {
    pub source_version: String,
    pub target_version: String,
    pub warnings: Vec<MigrationWarning>,
    pub unsupported_elements: Vec<UnsupportedElementReport>,
    pub output_document: Value,
}

impl MigrationReport {
    pub fn warnings(&self) -> &[MigrationWarning] {
        &self.warnings
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct MigrationResult {
    pub output_document: Value,
    pub report: MigrationReport,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum MigrationError {
    UnsupportedSourceVersion,
    UnsupportedTargetVersion,
    SourceValidationFailed,
    OutputValidationFailed,
    TransformFailed,
    UnrecoverableElement,
}

pub fn migrate_canvas_json(value: Value, target_version: CanvasSchemaVersion) -> Result<MigrationResult, MigrationError> {
    if !matches!(target_version, CanvasSchemaVersion::V1) {
        return Err(MigrationError::UnsupportedTargetVersion);
    }
    let source_version = match value.get("schema_version").and_then(Value::as_u64) {
        None => "v0".to_string(),
        Some(1) => "v1".to_string(),
        Some(_) => return Err(MigrationError::UnsupportedTargetVersion),
    };
    if source_version == "v0" && value.get("document_id").is_none() {
        return Err(MigrationError::UnsupportedSourceVersion);
    }
    let mut document = if source_version == "v0" {
        v0_to_v1::migrate_draft(value).map_err(|_| MigrationError::TransformFailed)?
    } else {
        value
    };
    let mut unsupported = Vec::new();
    if let Some(effect) = document.as_object_mut().and_then(|object| object.remove("legacy_effect")) {
        unsupported.push(UnsupportedElementReport {
            recoverable: true,
            json_pointer: "/unsupported_elements/0/raw".to_string(),
            raw: effect.clone(),
        });
        if let Some(items) = document["unsupported_elements"].as_array_mut() {
            items.push(json!({ "field_path": "/legacy_effect", "node_kind": "effect", "raw": effect }));
        }
    }
    validate_canvas_json(&document).map_err(|_| MigrationError::OutputValidationFailed)?;
    let report = MigrationReport {
        source_version: source_version.clone(),
        target_version: "v1".to_string(),
        warnings: if source_version == "v0" {
            vec![MigrationWarning { message: "draft document migrated to schema version 1".to_string() }]
        } else {
            Vec::new()
        },
        unsupported_elements: unsupported,
        output_document: document.clone(),
    };
    Ok(MigrationResult { output_document: document, report })
}
