pub mod scene_ops;

use scene_ops::{InverseSceneOp, SceneOp};

use crate::scene_graph::{CanvasDocument, SceneGraph};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TransactionScopeId(pub u64);

#[derive(Debug, Clone, PartialEq)]
pub struct TransactionEntry {
    pub scope_id: TransactionScopeId,
    pub actor_id: String,
    pub operation_count: usize,
    pub inverse: InverseSceneOp,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TransactionError {
    ScopeAlreadyOpen,
    NoOpenScope,
    NoUndoAvailable,
    NoRedoAvailable,
    OperationFailed,
    RollbackFailed,
    ActorMismatch,
}

struct OpenScope {
    scope_id: TransactionScopeId,
    actor_id: String,
    operation_count: usize,
    snapshot: CanvasDocument,
}

pub struct TransactionManager {
    next_scope: u64,
    open: Option<OpenScope>,
    undo_stack: Vec<TransactionEntry>,
    redo_stack: Vec<(TransactionEntry, CanvasDocument)>,
}

impl TransactionManager {
    pub fn new() -> Self {
        Self {
            next_scope: 1,
            open: None,
            undo_stack: Vec::new(),
            redo_stack: Vec::new(),
        }
    }

    pub fn begin_scope(&mut self, actor_id: impl Into<String>, _label: &str) -> Result<TransactionScopeId, TransactionError> {
        if self.open.is_some() {
            return Err(TransactionError::ScopeAlreadyOpen);
        }
        let scope_id = TransactionScopeId(self.next_scope);
        self.next_scope += 1;
        self.open = Some(OpenScope {
            scope_id: scope_id.clone(),
            actor_id: actor_id.into(),
            operation_count: 0,
            snapshot: CanvasDocument::new("pending"),
        });
        Ok(scope_id)
    }

    pub fn apply_scene_op(&mut self, document: &mut CanvasDocument, op: SceneOp) -> Result<(), TransactionError> {
        let scope = self.open.as_mut().ok_or(TransactionError::NoOpenScope)?;
        if scope.operation_count == 0 {
            scope.snapshot = document.clone();
        }
        let mut graph = SceneGraph::new(document.clone());
        scene_ops::apply(&mut graph, &op).map_err(|_| TransactionError::OperationFailed)?;
        scope.operation_count += 1;
        *document = graph.document;
        Ok(())
    }

    pub fn commit_scope(&mut self) -> Result<TransactionEntry, TransactionError> {
        let scope = self.open.take().ok_or(TransactionError::NoOpenScope)?;
        let entry = TransactionEntry {
            scope_id: scope.scope_id,
            actor_id: scope.actor_id,
            operation_count: scope.operation_count,
            inverse: InverseSceneOp::Restore(scope.snapshot),
        };
        self.undo_stack.push(entry.clone());
        self.redo_stack.clear();
        Ok(entry)
    }

    pub fn rollback_scope(&mut self, document: &mut CanvasDocument) -> Result<(), TransactionError> {
        let scope = self.open.take().ok_or(TransactionError::RollbackFailed)?;
        if scope.snapshot.document_id != "pending" {
            *document = scope.snapshot;
        }
        Ok(())
    }

    pub fn undo(&mut self, document: &mut CanvasDocument) -> Result<(), TransactionError> {
        let entry = self.undo_stack.pop().ok_or(TransactionError::NoUndoAvailable)?;
        let current = document.clone();
        scene_ops::apply_inverse(document, &entry.inverse);
        self.redo_stack.push((entry, current));
        Ok(())
    }

    pub fn redo(&mut self, document: &mut CanvasDocument) -> Result<(), TransactionError> {
        let (entry, restored) = self.redo_stack.pop().ok_or(TransactionError::NoRedoAvailable)?;
        *document = restored;
        self.undo_stack.push(entry);
        Ok(())
    }

    pub fn can_undo(&self) -> bool {
        !self.undo_stack.is_empty()
    }

    pub fn actor_matches(&self, actor_id: &str) -> Result<(), TransactionError> {
        let entry = self.undo_stack.last().ok_or(TransactionError::NoUndoAvailable)?;
        if entry.actor_id == actor_id {
            Ok(())
        } else {
            Err(TransactionError::ActorMismatch)
        }
    }
}

impl Default for TransactionManager {
    fn default() -> Self {
        Self::new()
    }
}
