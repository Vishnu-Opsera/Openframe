use editor_core::render_adapter::{build_render_deltas, build_render_tree, update_scene_node};
use editor_core::render_tree::{RenderDelta, RenderTreeState};
use editor_core::scene_graph::{hierarchy::node, CanvasDocument, SceneGraph, SceneNodeKind};

fn scene_with_group() -> SceneGraph {
    let mut graph = SceneGraph::new(CanvasDocument::new("doc-render"));
    let mut frame = node("frame-1", SceneNodeKind::Frame, "Frame");
    frame.transform.x = 10.0;
    frame.bounds.width = 100.0;
    let mut child = node("text-1", SceneNodeKind::Text, "Title");
    child.transform.x = 5.0;
    child.bounds.width = 20.0;
    frame.children.push(child);
    graph.insert_child(None, frame, 0).expect("frame");
    graph
}

#[test]
fn render_tree_adapter() {
    flattens_nested_groups_with_transform_inheritance();
    preserves_z_order_for_siblings();
}

#[test]
fn flattens_nested_groups_with_transform_inheritance() {
    let tree = build_render_tree(&scene_with_group()).expect("tree");
    let text = tree.primitives.iter().find(|item| item.node_id == "text-1").expect("text");
    assert_eq!(text.transform.x, 15.0);
    assert_eq!(text.bounds.width, 20.0);
}

#[test]
fn preserves_z_order_for_siblings() {
    let mut graph = SceneGraph::new(CanvasDocument::new("doc-z"));
    graph.insert_child(None, node("b", SceneNodeKind::Frame, "B"), 0).unwrap();
    graph.insert_child(None, node("a", SceneNodeKind::Text, "A"), 1).unwrap();
    let tree = build_render_tree(&graph).unwrap();
    assert_eq!(tree.primitives[0].node_id, "b");
    assert!(tree.primitives[0].z_order <= tree.primitives[1].z_order);
}

#[test]
fn render_tree_adapter_delta_updates() {
    emits_insert_update_delete_deltas();
}

#[test]
fn emits_insert_update_delete_deltas() {
    let graph = scene_with_group();
    let empty = RenderTreeState::empty();
    let inserted = build_render_deltas(&graph, &empty).unwrap();
    assert!(inserted.deltas.iter().any(|delta| matches!(delta, RenderDelta::Insert(_))));
    let previous = build_render_tree(&graph).unwrap();
    let mut changed = graph.clone();
    changed.document.pages[0].fills.push(editor_core::scene_graph::styles::Fill {
        color: "#ffffff".to_string(),
        opacity: 0.5,
    });
    let updated = update_scene_node(&changed, &previous, "frame-1").unwrap();
    assert!(updated.deltas.iter().any(|delta| matches!(delta, RenderDelta::Update(_))));
    assert!(updated.deltas.iter().all(|delta| !matches!(delta, RenderDelta::FullRebuild)));
    let mut removed = graph.clone();
    removed.document.pages.clear();
    let deleted = build_render_deltas(&removed, &previous).unwrap();
    assert!(deleted.deltas.iter().any(|delta| matches!(delta, RenderDelta::Delete { .. })));
}
