use crate::scene_graph::{hierarchy::node, CanvasDocument, HierarchyOp, NodeId, SceneGraph, SceneNode, SceneNodeKind};

#[derive(Debug, Clone, PartialEq)]
pub enum SceneOp {
    Insert {
        parent_id: Option<NodeId>,
        node: Box<SceneNode>,
        index: usize,
    },
    Move {
        node_id: NodeId,
        new_parent_id: Option<NodeId>,
        index: usize,
    },
    Remove { node_id: NodeId },
    Reorder {
        parent_id: Option<NodeId>,
        node_id: NodeId,
        index: usize,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub enum InverseSceneOp {
    Restore(CanvasDocument),
}

pub fn apply(graph: &mut SceneGraph, op: &SceneOp) -> Result<(), crate::scene_graph::HierarchyError> {
    let owned = match op {
        SceneOp::Insert { parent_id, node, index } => HierarchyOp::Insert {
            parent_id: parent_id.clone(),
            node: node.clone(),
            index: *index,
        },
        SceneOp::Move { node_id, new_parent_id, index } => HierarchyOp::Move {
            node_id: node_id.clone(),
            new_parent_id: new_parent_id.clone(),
            index: *index,
        },
        SceneOp::Remove { node_id } => HierarchyOp::Remove { node_id: node_id.clone() },
        SceneOp::Reorder { parent_id, node_id, index } => HierarchyOp::Reorder {
            parent_id: parent_id.clone(),
            node_id: node_id.clone(),
            index: *index,
        },
    };
    graph.apply_hierarchy_op(owned)
}

pub fn apply_inverse(document: &mut CanvasDocument, inverse: &InverseSceneOp) {
    match inverse {
        InverseSceneOp::Restore(snapshot) => *document = snapshot.clone(),
    }
}

pub fn frame(id: &str, name: &str) -> SceneNode {
    node(id, SceneNodeKind::Frame, name)
}
