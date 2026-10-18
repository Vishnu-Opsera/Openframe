use serde::{Deserialize, Serialize};

use super::geometry::{Bounds, Transform};
use super::id::NodeId;
use super::styles::{Effects, Fill, Stroke, TextStyle};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SceneNodeKind {
    Page,
    Frame,
    Group,
    Vector,
    Text,
    Component,
    Instance,
    TokenCollection,
    ExportMetadata,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SceneNode {
    pub id: NodeId,
    pub kind: SceneNodeKind,
    pub name: String,
    pub children: Vec<SceneNode>,
    pub transform: Transform,
    pub bounds: Bounds,
    pub fills: Vec<Fill>,
    pub strokes: Vec<Stroke>,
    pub effects: Effects,
    pub text: Option<String>,
    pub text_style: Option<TextStyle>,
    pub vector_path: Option<String>,
    pub component_id: Option<NodeId>,
    pub token_id: Option<String>,
}

impl SceneNode {
    pub fn kind(&self) -> SceneNodeKind {
        self.kind
    }

    pub fn page(id: impl Into<String>, name: impl Into<String>) -> Self {
        Self::new(id, SceneNodeKind::Page, name)
    }

    fn new(id: impl Into<String>, kind: SceneNodeKind, name: impl Into<String>) -> Self {
        Self {
            id: NodeId(id.into()),
            kind,
            name: name.into(),
            children: Vec::new(),
            transform: Transform::identity(),
            bounds: Bounds::zero(),
            fills: Vec::new(),
            strokes: Vec::new(),
            effects: Effects { shadows: Vec::new() },
            text: None,
            text_style: None,
            vector_path: None,
            component_id: None,
            token_id: None,
        }
    }
}
