use serde::{Deserialize, Serialize};

use super::nodes::SceneNode;
use super::styles::{ExportMetadata, TokenCollection};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DocumentError {
    pub field_path: String,
    pub node_kind: String,
    pub message: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UnsupportedElement {
    pub field_path: String,
    pub node_kind: String,
    pub raw: serde_json::Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CanvasDocument {
    #[serde(default = "default_schema_version")]
    pub schema_version: u32,
    pub document_id: String,
    #[serde(default)]
    pub pages: Vec<SceneNode>,
    #[serde(default)]
    pub tokens: Vec<TokenCollection>,
    #[serde(default)]
    pub components: Vec<SceneNode>,
    #[serde(default)]
    pub export_metadata: ExportMetadata,
    #[serde(default)]
    pub unsupported_elements: Vec<UnsupportedElement>,
}

fn default_schema_version() -> u32 {
    1
}

impl CanvasDocument {
    pub fn new(document_id: impl Into<String>) -> Self {
        Self {
            schema_version: 1,
            document_id: document_id.into(),
            pages: Vec::new(),
            tokens: Vec::new(),
            components: Vec::new(),
            export_metadata: ExportMetadata::default(),
            unsupported_elements: Vec::new(),
        }
    }

    pub fn from_json(value: &str) -> Result<Self, DocumentError> {
        serde_json::from_str(value).map_err(|error| DocumentError {
            field_path: error
                .to_string()
                .split(" at ")
                .next()
                .unwrap_or("document")
                .to_string(),
            node_kind: "document".to_string(),
            message: error.to_string(),
        })
    }
}
