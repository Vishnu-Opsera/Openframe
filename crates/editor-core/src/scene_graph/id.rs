use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct NodeId(pub String);

impl NodeId {
    pub fn new(value: impl Into<String>) -> Self {
        Self(value.into())
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

pub trait NodeIdGenerator {
    fn next_id(&mut self) -> NodeId;
}

#[derive(Debug, Clone)]
pub struct DeterministicIdGenerator {
    prefix: String,
    next: u64,
}

impl DeterministicIdGenerator {
    pub fn new(prefix: impl Into<String>) -> Self {
        Self {
            prefix: prefix.into(),
            next: 1,
        }
    }
}

impl NodeIdGenerator for DeterministicIdGenerator {
    fn next_id(&mut self) -> NodeId {
        let id = NodeId::new(format!("{}-{}", self.prefix, self.next));
        self.next += 1;
        id
    }
}
