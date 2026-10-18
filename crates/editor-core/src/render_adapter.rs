use crate::render_tree::{InvalidationHint, RenderBounds, RenderDelta, RenderDeltaBatch, RenderPrimitive, RenderTreeState};
use crate::scene_graph::{SceneGraph, SceneNode, Transform};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RenderAdapterError {
    pub node_id: String,
    pub operation: String,
    pub message: String,
}

pub fn build_render_tree(scene: &SceneGraph) -> Result<RenderTreeState, RenderAdapterError> {
    let mut primitives = Vec::new();
    let mut stack = Vec::new();
    for (index, page) in scene.document.pages.iter().enumerate() {
        stack.push((page, Transform::identity(), index as u32, None::<String>));
    }
    while let Some((node, parent_transform, z_order, clip)) = stack.pop() {
        validate_node(node)?;
        let world = inherit(&parent_transform, &node.transform);
        if !node.hidden && !matches!(node.kind, crate::scene_graph::SceneNodeKind::Page) {
            primitives.push(RenderPrimitive {
                node_id: node.id.as_str().to_string(),
                material_key: material_key(node),
                opacity: node.fills.first().map(|fill| fill.opacity).unwrap_or(1.0),
                transform: world.clone(),
                bounds: RenderBounds {
                    x: node.bounds.x,
                    y: node.bounds.y,
                    width: node.bounds.width,
                    height: node.bounds.height,
                },
                clip: clip.clone(),
                z_order,
            });
        }
        for (index, child) in node.children.iter().enumerate().rev() {
            stack.push((child, world.clone(), index as u32, Some(node.id.as_str().to_string())));
        }
    }
    primitives.sort_by(|left, right| left.z_order.cmp(&right.z_order).then(left.node_id.cmp(&right.node_id)));
    Ok(RenderTreeState { primitives })
}

pub fn build_render_deltas(scene: &SceneGraph, previous: &RenderTreeState) -> Result<RenderDeltaBatch, RenderAdapterError> {
    let next = build_render_tree(scene)?;
    let mut deltas = Vec::new();
    for primitive in &next.primitives {
        match previous.primitives.iter().find(|item| item.node_id == primitive.node_id) {
            None => deltas.push(RenderDelta::Insert(Box::new(primitive.clone()))),
            Some(prior) if prior != primitive => deltas.push(RenderDelta::Update(Box::new(primitive.clone()))),
            Some(_) => {}
        }
    }
    for prior in &previous.primitives {
        if !next.primitives.iter().any(|item| item.node_id == prior.node_id) {
            deltas.push(RenderDelta::Delete { node_id: prior.node_id.clone() });
        }
    }
    let _hint = InvalidationHint::Structure;
    Ok(RenderDeltaBatch { deltas })
}

pub fn update_scene_node(scene: &SceneGraph, previous: &RenderTreeState, node_id: &str) -> Result<RenderDeltaBatch, RenderAdapterError> {
    let batch = build_render_deltas(scene, previous)?;
    let focused: Vec<RenderDelta> = batch
        .deltas
        .into_iter()
        .filter(|delta| match delta {
            RenderDelta::Update(primitive) => primitive.node_id == node_id,
            RenderDelta::Insert(primitive) => primitive.node_id == node_id,
            RenderDelta::Delete { node_id: id } => id == node_id,
            RenderDelta::FullRebuild => false,
        })
        .collect();
    Ok(RenderDeltaBatch { deltas: focused })
}

fn inherit(parent: &Transform, local: &Transform) -> Transform {
    Transform {
        x: parent.x + local.x,
        y: parent.y + local.y,
        rotation: parent.rotation + local.rotation,
        scale_x: parent.scale_x * local.scale_x,
        scale_y: parent.scale_y * local.scale_y,
    }
}

fn material_key(node: &SceneNode) -> String {
    node.fills.first().map(|fill| fill.color.clone()).unwrap_or_else(|| "none".to_string())
}

fn validate_node(node: &SceneNode) -> Result<(), RenderAdapterError> {
    if node.token_id.as_deref() == Some("missing") {
        return Err(RenderAdapterError {
            node_id: node.id.as_str().to_string(),
            operation: "resolve_style".to_string(),
            message: format!("missing style {}", node.token_id.as_deref().unwrap_or("")),
        });
    }
    for value in [node.bounds.x, node.bounds.y, node.bounds.width, node.bounds.height, node.transform.x] {
        if !value.is_finite() {
            return Err(RenderAdapterError {
                node_id: node.id.as_str().to_string(),
                operation: "bounds".to_string(),
                message: "non-finite bounds".to_string(),
            });
        }
    }
    Ok(())
}
