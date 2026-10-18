use std::fs;
use std::path::Path;

use canvas_file::{validate_canvas_file_version, validate_canvas_json};
use serde::Serialize;
use serde_json::Value;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct CanvasFileCommandError {
    pub code: String,
    pub message: String,
    pub path: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct OpenedCanvasFile {
    pub document: Value,
    pub schema_version: u32,
    pub path: String,
}

pub fn open_canvas_file_from_path(path: &Path) -> Result<OpenedCanvasFile, CanvasFileCommandError> {
    let raw = fs::read_to_string(path).map_err(|_| error("READ_FAILED", "Unable to read canvas file", path))?;
    let document: Value = serde_json::from_str(&raw).map_err(|_| error("INVALID_JSON", "Canvas file is not valid JSON", path))?;
    let version = validate_canvas_file_version(&document).map_err(|failure| {
        let code = if failure.errors.first().map(|item| item.code.as_str()) == Some("unsupported_schema_version") {
            "UNSUPPORTED_SCHEMA_VERSION"
        } else {
            "SCHEMA_VALIDATION_FAILED"
        };
        error(code, "Canvas file failed validation", path)
    })?;
    validate_canvas_json(&document).map_err(|_| error("SCHEMA_VALIDATION_FAILED", "Canvas file failed schema validation", path))?;
    let _ = version;
    Ok(OpenedCanvasFile {
        document,
        schema_version: 1,
        path: path.display().to_string(),
    })
}

pub fn atomic_write_canvas_file(path: &Path, contents: &str) -> Result<usize, CanvasFileCommandError> {
    let parent = path.parent().ok_or_else(|| error("WRITE_FAILED", "Canvas path has no parent directory", path))?;
    if !parent.exists() {
        return Err(error("WRITE_FAILED", "Parent directory does not exist", path));
    }
    let temporary = parent.join(format!(".{}.tmp", path.file_name().and_then(|name| name.to_str()).unwrap_or("canvas")));
    fs::write(&temporary, contents).map_err(|_| error("WRITE_FAILED", "Unable to write temporary canvas file", path))?;
    fs::rename(&temporary, path).map_err(|_| error("WRITE_FAILED", "Unable to replace canvas file", path))?;
    Ok(contents.len())
}

pub fn save_canvas_file_to_path(path: &Path, document: &Value) -> Result<usize, CanvasFileCommandError> {
    validate_canvas_json(document).map_err(|_| error("SCHEMA_VALIDATION_FAILED", "Refusing to save an invalid canvas file", path))?;
    let contents = serde_json::to_string_pretty(document).map_err(|_| error("INVALID_JSON", "Unable to serialize canvas file", path))?;
    atomic_write_canvas_file(path, &contents)
}

pub fn open_canvas_file(path: String) -> Result<OpenedCanvasFile, CanvasFileCommandError> {
    if path == "cancel" {
        return Err(CanvasFileCommandError { code: "USER_CANCELLED".to_string(), message: "File dialog cancelled".to_string(), path: None });
    }
    open_canvas_file_from_path(Path::new(&path))
}

pub fn save_canvas_file(path: String, document: Value) -> Result<usize, CanvasFileCommandError> {
    save_canvas_file_to_path(Path::new(&path), &document)
}

fn error(code: &str, message: &str, path: &Path) -> CanvasFileCommandError {
    CanvasFileCommandError {
        code: code.to_string(),
        message: message.to_string(),
        path: Some(path.display().to_string()),
    }
}
