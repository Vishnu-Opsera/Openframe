use std::fs;

use editor_core::scene_graph::{
    CanvasDocument, DeterministicIdGenerator, HierarchyError, HierarchyOp, NodeId, NodeIdGenerator, SceneGraph, SceneNodeKind,
};
use editor_core::scene_graph::hierarchy::node;
use serde::Deserialize;

#[test]
fn hierarchy_operations() {
    let mut graph = SceneGraph::new(CanvasDocument::new("doc-empty"));
    let mut ids = DeterministicIdGenerator::new("node");
    let created = ids.next_id();
    graph
        .insert_child(None, node(created.as_str(), SceneNodeKind::Frame, "Frame"), 0)
        .expect("insert");
    let child = NodeId::new("child");
    graph
        .insert_child(Some(&created), node("child", SceneNodeKind::Text, "Title"), 0)
        .expect("child");
    graph.reorder_child(Some(&created), &child, 0).expect("reorder");
    let chain = graph.get_parent_chain(&child).expect("chain");
    assert_eq!(chain, vec![created.clone()]);
    let world = graph.compute_world_transform(&child).expect("world");
    assert_eq!(world.scale_x, 1.0);
    graph.remove_node(&child).expect("remove");
    graph.move_node(&created, None, 0).expect("move");
}

#[test]
fn hierarchy_roundtrip_fixture() {
    #[derive(Deserialize)]
    struct FixtureOp {
        op: String,
        id: String,
        kind: Option<String>,
        name: Option<String>,
        index: Option<usize>,
        parent_id: Option<String>,
    }
    #[derive(Deserialize)]
    struct Fixture {
        document_id: String,
        operations: Vec<FixtureOp>,
        expected_z_order: Vec<String>,
    }
    let raw = fs::read_to_string(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/canvas/ops/hierarchy_operations.json"
    ))
    .expect("fixture");
    let fixture: Fixture = serde_json::from_str(&raw).expect("json");
    let mut graph = SceneGraph::new(CanvasDocument::new(fixture.document_id));
    for operation in fixture.operations {
        let result = match operation.op.as_str() {
            "insert" => graph.apply_hierarchy_op(HierarchyOp::Insert {
                parent_id: operation.parent_id.map(NodeId::new),
                node: Box::new(node(
                    &operation.id,
                    match operation.kind.as_deref() {
                        Some("text") => SceneNodeKind::Text,
                        Some("group") => SceneNodeKind::Group,
                        Some("vector") => SceneNodeKind::Vector,
                        _ => SceneNodeKind::Frame,
                    },
                    operation.name.as_deref().unwrap_or("Node"),
                )),
                index: operation.index.unwrap_or(0),
            }),
            "move" => graph.apply_hierarchy_op(HierarchyOp::Move {
                node_id: NodeId::new(operation.id),
                new_parent_id: operation.parent_id.map(NodeId::new),
                index: operation.index.unwrap_or(0),
            }),
            "remove" => graph.apply_hierarchy_op(HierarchyOp::Remove { node_id: NodeId::new(operation.id) }),
            "reorder" => graph.apply_hierarchy_op(HierarchyOp::Reorder {
                parent_id: None,
                node_id: NodeId::new(operation.id),
                index: operation.index.unwrap_or(0),
            }),
            _ => panic!("unknown op"),
        };
        result.expect("operation");
    }
    assert_eq!(graph.z_order(None).expect("z"), fixture.expected_z_order);
}

#[test]
fn hierarchy_rejects_cycles_and_duplicate_ids() {
    let mut graph = SceneGraph::new(CanvasDocument::new("doc-errors"));
    graph.insert_child(None, node("parent", SceneNodeKind::Frame, "Parent"), 0).unwrap();
    graph
        .insert_child(Some(&NodeId::new("parent")), node("child", SceneNodeKind::Group, "Child"), 0)
        .unwrap();
    let cycle = graph.move_node(&NodeId::new("parent"), Some(&NodeId::new("child")), 0);
    assert_eq!(cycle, Err(HierarchyError::CycleDetected));
    let duplicate = graph.insert_child(None, node("parent", SceneNodeKind::Frame, "Again"), 1);
    assert_eq!(duplicate, Err(HierarchyError::DuplicateNodeId));
}
