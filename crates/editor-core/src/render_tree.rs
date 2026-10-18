use serde::{Deserialize, Serialize};

use crate::scene_graph::Transform;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RenderBounds {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct MaterialKey(pub String);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum InvalidationHint {
    None,
    Paint,
    Transform,
    Structure,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RenderPrimitive {
    pub node_id: String,
    pub material_key: String,
    pub opacity: f64,
    pub transform: Transform,
    pub bounds: RenderBounds,
    pub clip: Option<String>,
    pub z_order: u32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum RenderDelta {
    Insert(Box<RenderPrimitive>),
    Update(Box<RenderPrimitive>),
    Delete { node_id: String },
    FullRebuild,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RenderDeltaBatch {
    pub deltas: Vec<RenderDelta>,
}

impl RenderDeltaBatch {
    pub fn is_empty(&self) -> bool {
        self.deltas.is_empty()
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RenderTreeState {
    pub primitives: Vec<RenderPrimitive>,
}

impl RenderTreeState {
    pub fn empty() -> Self {
        Self { primitives: Vec::new() }
    }
}
