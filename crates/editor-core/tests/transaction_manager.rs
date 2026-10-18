use std::fs;

use editor_core::scene_graph::CanvasDocument;
use editor_core::transactions::scene_ops::{frame, SceneOp};
use editor_core::transactions::{TransactionError, TransactionManager};
use serde::Deserialize;

#[test]
fn transaction_manager() {
    let mut manager = TransactionManager::new();
    let mut document = CanvasDocument::new("doc-tx");
    assert_eq!(manager.undo(&mut document), Err(TransactionError::NoUndoAvailable));
    manager.begin_scope("local-user", "edit").unwrap();
    assert_eq!(manager.begin_scope("local-user", "nested"), Err(TransactionError::ScopeAlreadyOpen));
    manager
        .apply_scene_op(&mut document, SceneOp::Insert { parent_id: None, node: Box::new(frame("frame-1", "Frame")), index: 0 })
        .unwrap();
    let entry = manager.commit_scope().unwrap();
    assert_eq!(entry.actor_id, "local-user");
    assert_eq!(entry.operation_count, 1);
    assert!(manager.can_undo());
    manager.undo(&mut document).unwrap();
    assert!(document.pages.is_empty());
    manager.redo(&mut document).unwrap();
    assert_eq!(document.pages.len(), 1);
    manager.begin_scope("local-user", "rollback").unwrap();
    manager
        .apply_scene_op(&mut document, SceneOp::Insert { parent_id: None, node: Box::new(frame("temp", "Temp")), index: 1 })
        .unwrap();
    manager.rollback_scope(&mut document).unwrap();
    assert_eq!(document.pages.len(), 1);
    assert!(manager.actor_matches("other").is_err());
}

#[test]
fn transaction_scene_graph_integration() {
    #[derive(Deserialize)]
    struct Step {
        kind: String,
        id: Option<String>,
        parent_id: Option<String>,
        index: Option<usize>,
    }
    #[derive(Deserialize)]
    struct Group {
        label: String,
        steps: Vec<Step>,
        rollback: bool,
    }
    #[derive(Deserialize)]
    struct Fixture {
        groups: Vec<Group>,
    }
    let raw = fs::read_to_string(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/canvas/ops/grouped_transactions.json"
    ))
    .unwrap();
    let fixture: Fixture = serde_json::from_str(&raw).unwrap();
    let mut manager = TransactionManager::new();
    let mut document = CanvasDocument::new("doc-grouped");
    for group in fixture.groups {
        manager.begin_scope("local-user", &group.label).unwrap();
        for step in group.steps {
            let op = match step.kind.as_str() {
                "insert" => SceneOp::Insert {
                    parent_id: step.parent_id.map(editor_core::scene_graph::NodeId::new),
                    node: Box::new(frame(step.id.as_deref().unwrap_or("node"), "Node")),
                    index: step.index.unwrap_or(0),
                },
                "move" => SceneOp::Move {
                    node_id: editor_core::scene_graph::NodeId::new(step.id.unwrap_or_default()),
                    new_parent_id: step.parent_id.map(editor_core::scene_graph::NodeId::new),
                    index: step.index.unwrap_or(0),
                },
                "reorder" => SceneOp::Reorder {
                    parent_id: step.parent_id.map(editor_core::scene_graph::NodeId::new),
                    node_id: editor_core::scene_graph::NodeId::new(step.id.unwrap_or_default()),
                    index: step.index.unwrap_or(0),
                },
                _ => continue,
            };
            manager.apply_scene_op(&mut document, op).unwrap();
        }
        if group.rollback {
            manager.rollback_scope(&mut document).unwrap();
        } else {
            manager.commit_scope().unwrap();
        }
    }
    assert!(!document.pages.is_empty());
    while manager.can_undo() {
        manager.undo(&mut document).unwrap();
    }
    assert!(document.pages.is_empty());
}
