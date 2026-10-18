use jsonschema::Validator;
use serde::{Deserialize, Serialize};
use serde_json::Value;

const SCHEMA_V1: &str = include_str!("../../../schemas/canvas/v1/canvas.schema.json");

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CanvasSchemaVersion {
    V1,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CanvasValidationError {
    pub schema_version: Option<u32>,
    pub json_pointer: String,
    pub message: String,
    pub severity: String,
    pub code: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CanvasValidationErrorSet {
    pub errors: Vec<CanvasValidationError>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CanvasValidationReport {
    pub schema_version: CanvasSchemaVersion,
    pub valid: bool,
}

pub fn validate_canvas_file_version(value: &Value) -> Result<CanvasSchemaVersion, CanvasValidationErrorSet> {
    match value.get("schema_version") {
        None => Err(error_set(None, "/schema_version", "schema_version is required", "missing_schema_version")),
        Some(Value::Number(number)) if number.as_u64() == Some(1) => Ok(CanvasSchemaVersion::V1),
        Some(other) => Err(error_set(
            other.as_u64().map(|version| version as u32),
            "/schema_version",
            "UnsupportedSchemaVersion",
            "unsupported_schema_version",
        )),
    }
}

pub fn validate_canvas_json(value: &Value) -> Result<CanvasValidationReport, CanvasValidationErrorSet> {
    let version = validate_canvas_file_version(value)?;
    let schema: Value = serde_json::from_str(SCHEMA_V1).expect("canvas schema is valid json");
    let validator = Validator::new(&schema).map_err(|error| {
        error_set(Some(1), "", &error.to_string(), "schema_compile")
    })?;
    let mut errors = Vec::new();
    for error in validator.iter_errors(value) {
        errors.push(CanvasValidationError {
            schema_version: Some(1),
            json_pointer: error.instance_path.to_string(),
            message: error.to_string(),
            severity: "error".to_string(),
            code: "schema_violation".to_string(),
        });
    }
    if let Some(pointer) = duplicate_id_pointer(value) {
        errors.push(CanvasValidationError {
            schema_version: Some(1),
            json_pointer: pointer,
            message: "duplicate node id".to_string(),
            severity: "error".to_string(),
            code: "duplicate_node_id".to_string(),
        });
    }
    if errors.is_empty() {
        Ok(CanvasValidationReport { schema_version: version, valid: true })
    } else {
        Err(CanvasValidationErrorSet { errors })
    }
}

fn duplicate_id_pointer(value: &Value) -> Option<String> {
    let mut seen = std::collections::BTreeSet::new();
    let mut duplicate = None;
    for key in ["pages", "nodes", "components"] {
        if let Some(items) = value.get(key).and_then(Value::as_array) {
            walk_ids(items, &mut seen, &mut duplicate);
        }
    }
    duplicate
}

fn walk_ids(nodes: &[Value], seen: &mut std::collections::BTreeSet<String>, duplicate: &mut Option<String>) {
    for node in nodes {
        if let Some(id) = node.get("id").and_then(Value::as_str) {
            if !seen.insert(id.to_string()) && duplicate.is_none() {
                *duplicate = Some(format!("/id/{id}"));
            }
        }
        if let Some(children) = node.get("children").and_then(Value::as_array) {
            walk_ids(children, seen, duplicate);
        }
    }
}

fn error_set(schema_version: Option<u32>, pointer: &str, message: &str, code: &str) -> CanvasValidationErrorSet {
    CanvasValidationErrorSet {
        errors: vec![CanvasValidationError {
            schema_version,
            json_pointer: pointer.to_string(),
            message: message.to_string(),
            severity: "error".to_string(),
            code: code.to_string(),
        }],
    }
}
