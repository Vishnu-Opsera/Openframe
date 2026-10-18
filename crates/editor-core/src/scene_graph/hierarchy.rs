use super::document::CanvasDocument;
use super::geometry::Transform;
use super::id::NodeId;
use super::nodes::{SceneNode, SceneNodeKind};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum HierarchyError {
    NodeNotFound,
    ParentNotFound,
    DuplicateNodeId,
    CycleDetected,
    InvalidChildIndex,
    ImmutableRoot,
}

#[derive(Debug, Clone, PartialEq)]
pub enum HierarchyOp {
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
pub struct SceneGraph {
    pub document: CanvasDocument,
}

impl SceneGraph {
    pub fn new(document: CanvasDocument) -> Self {
        Self { document }
    }

    pub fn apply_hierarchy_op(&mut self, op: HierarchyOp) -> Result<(), HierarchyError> {
        match op {
            HierarchyOp::Insert { parent_id, node, index } => self.insert_child(parent_id.as_ref(), *node, index),
            HierarchyOp::Move { node_id, new_parent_id, index } => self.move_node(&node_id, new_parent_id.as_ref(), index),
            HierarchyOp::Remove { node_id } => self.remove_node(&node_id),
            HierarchyOp::Reorder { parent_id, node_id, index } => self.reorder_child(parent_id.as_ref(), &node_id, index),
        }
    }

    pub fn insert_child(&mut self, parent_id: Option<&NodeId>, node: SceneNode, index: usize) -> Result<(), HierarchyError> {
        if self.contains(&node.id) {
            return Err(HierarchyError::DuplicateNodeId);
        }
        if let Some(parent) = parent_id {
            if self.find(parent).is_none() {
                return Err(HierarchyError::ParentNotFound);
            }
        }
        let siblings = self.children_mut(parent_id)?;
        if index > siblings.len() {
            return Err(HierarchyError::InvalidChildIndex);
        }
        siblings.insert(index, node);
        Ok(())
    }

    pub fn move_node(&mut self, node_id: &NodeId, new_parent_id: Option<&NodeId>, index: usize) -> Result<(), HierarchyError> {
        if node_id.as_str() == self.document.document_id {
            return Err(HierarchyError::ImmutableRoot);
        }
        if self.find(node_id).is_none() {
            return Err(HierarchyError::NodeNotFound);
        }
        if let Some(parent) = new_parent_id {
            if parent == node_id || self.is_descendant(node_id, parent) {
                return Err(HierarchyError::CycleDetected);
            }
            if self.find(parent).is_none() {
                return Err(HierarchyError::ParentNotFound);
            }
        }
        let node = self.detach(node_id)?;
        let backup = node.clone();
        if let Err(error) = self.insert_child(new_parent_id, node, index) {
            self.restore(backup);
            return Err(error);
        }
        Ok(())
    }

    pub fn remove_node(&mut self, node_id: &NodeId) -> Result<(), HierarchyError> {
        if node_id.as_str() == self.document.document_id {
            return Err(HierarchyError::ImmutableRoot);
        }
        if self.find(node_id).is_none() {
            return Err(HierarchyError::NodeNotFound);
        }
        self.detach(node_id)?;
        Ok(())
    }

    pub fn reorder_child(&mut self, parent_id: Option<&NodeId>, node_id: &NodeId, index: usize) -> Result<(), HierarchyError> {
        let siblings = self.children_mut(parent_id)?;
        let current = siblings.iter().position(|node| &node.id == node_id).ok_or(HierarchyError::NodeNotFound)?;
        if index >= siblings.len() {
            return Err(HierarchyError::InvalidChildIndex);
        }
        let node = siblings.remove(current);
        siblings.insert(index, node);
        Ok(())
    }

    pub fn get_parent_chain(&self, node_id: &NodeId) -> Result<Vec<NodeId>, HierarchyError> {
        if self.find(node_id).is_none() {
            return Err(HierarchyError::NodeNotFound);
        }
        let mut chain = Vec::new();
        let mut current = self.parent_of(node_id);
        while let Some(parent) = current {
            let next = self.parent_of(&parent);
            chain.push(parent);
            current = next;
        }
        Ok(chain)
    }

    pub fn compute_world_transform(&self, node_id: &NodeId) -> Result<Transform, HierarchyError> {
        let node = self.find(node_id).ok_or(HierarchyError::NodeNotFound)?;
        let mut world = node.transform.clone();
        for parent_id in self.get_parent_chain(node_id)? {
            let parent = self.find(&parent_id).ok_or(HierarchyError::ParentNotFound)?;
            world.x += parent.transform.x;
            world.y += parent.transform.y;
            world.rotation += parent.transform.rotation;
            world.scale_x *= parent.transform.scale_x;
            world.scale_y *= parent.transform.scale_y;
        }
        Ok(world)
    }

    pub fn z_order(&self, parent_id: Option<&NodeId>) -> Result<Vec<String>, HierarchyError> {
        Ok(self.children(parent_id)?.iter().map(|node| node.id.as_str().to_string()).collect())
    }

    pub fn contains(&self, id: &NodeId) -> bool {
        self.find(id).is_some()
    }

    fn find(&self, id: &NodeId) -> Option<&SceneNode> {
        fn walk<'a>(nodes: &'a [SceneNode], id: &NodeId) -> Option<&'a SceneNode> {
            for node in nodes {
                if &node.id == id {
                    return Some(node);
                }
                if let Some(found) = walk(&node.children, id) {
                    return Some(found);
                }
            }
            None
        }
        walk(&self.document.pages, id).or_else(|| walk(&self.document.components, id))
    }

    fn children(&self, parent_id: Option<&NodeId>) -> Result<&[SceneNode], HierarchyError> {
        match parent_id {
            None => Ok(&self.document.pages),
            Some(parent) => Ok(&self.find(parent).ok_or(HierarchyError::ParentNotFound)?.children),
        }
    }

    fn children_mut(&mut self, parent_id: Option<&NodeId>) -> Result<&mut Vec<SceneNode>, HierarchyError> {
        match parent_id {
            None => Ok(&mut self.document.pages),
            Some(parent) => {
                fn walk<'a>(nodes: &'a mut [SceneNode], id: &NodeId) -> Option<&'a mut Vec<SceneNode>> {
                    for node in nodes {
                        if &node.id == id {
                            return Some(&mut node.children);
                        }
                        if let Some(found) = walk(&mut node.children, id) {
                            return Some(found);
                        }
                    }
                    None
                }
                walk(&mut self.document.pages, parent)
                    .or_else(|| {
                        let components = &mut self.document.components;
                        walk(components, parent)
                    })
                    .ok_or(HierarchyError::ParentNotFound)
            }
        }
    }

    fn parent_of(&self, id: &NodeId) -> Option<NodeId> {
        fn walk(nodes: &[SceneNode], id: &NodeId, parent: Option<&NodeId>) -> Option<NodeId> {
            for node in nodes {
                if &node.id == id {
                    return parent.cloned();
                }
                if let Some(found) = walk(&node.children, id, Some(&node.id)) {
                    return Some(found);
                }
            }
            None
        }
        walk(&self.document.pages, id, None).or_else(|| walk(&self.document.components, id, None))
    }

    fn is_descendant(&self, ancestor: &NodeId, candidate: &NodeId) -> bool {
        let mut current = Some(candidate.clone());
        while let Some(id) = current {
            if &id == ancestor {
                return true;
            }
            current = self.parent_of(&id);
        }
        false
    }

    fn detach(&mut self, id: &NodeId) -> Result<SceneNode, HierarchyError> {
        fn take(nodes: &mut Vec<SceneNode>, id: &NodeId) -> Option<SceneNode> {
            if let Some(index) = nodes.iter().position(|node| &node.id == id) {
                return Some(nodes.remove(index));
            }
            for node in nodes {
                if let Some(found) = take(&mut node.children, id) {
                    return Some(found);
                }
            }
            None
        }
        take(&mut self.document.pages, id)
            .or_else(|| take(&mut self.document.components, id))
            .ok_or(HierarchyError::NodeNotFound)
    }

    fn restore(&mut self, node: SceneNode) {
        self.document.pages.push(node);
    }
}

pub fn node(id: &str, kind: SceneNodeKind, name: &str) -> SceneNode {
    let mut created = SceneNode::page(id, name);
    created.kind = kind;
    created
}
