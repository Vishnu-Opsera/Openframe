#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ViewportRect {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct CullMargin {
    pub pixels: f32,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RenderBounds {
    pub node_id: String,
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct VisiblePrimitiveSet {
    pub node_ids: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct SpatialIndexStats {
    pub total: usize,
    pub indexed: usize,
    pub visible: usize,
}

#[derive(Debug, Clone, PartialEq)]
pub enum IndexDelta {
    Insert(RenderBounds),
    Update(RenderBounds),
    Delete(String),
}

#[derive(Debug, Default, Clone)]
pub struct SpatialIndex {
    entries: Vec<RenderBounds>,
}

impl SpatialIndex {
    pub fn query_viewport(&self, viewport: ViewportRect, margin: CullMargin) -> VisiblePrimitiveSet {
        let min_x = viewport.x - margin.pixels;
        let min_y = viewport.y - margin.pixels;
        let max_x = viewport.x + viewport.width + margin.pixels;
        let max_y = viewport.y + viewport.height + margin.pixels;
        VisiblePrimitiveSet {
            node_ids: self
                .entries
                .iter()
                .filter(|entry| entry.x < max_x && entry.x + entry.width > min_x && entry.y < max_y && entry.y + entry.height > min_y)
                .map(|entry| entry.node_id.clone())
                .collect(),
        }
    }

    pub fn apply_deltas(&mut self, deltas: &[IndexDelta]) {
        for delta in deltas {
            match delta {
                IndexDelta::Insert(bounds) => self.entries.push(bounds.clone()),
                IndexDelta::Update(bounds) => {
                    if let Some(existing) = self.entries.iter_mut().find(|entry| entry.node_id == bounds.node_id) {
                        *existing = bounds.clone();
                    }
                }
                IndexDelta::Delete(node_id) => self.entries.retain(|entry| entry.node_id != *node_id),
            }
        }
    }

    pub fn stats(&self, viewport: ViewportRect, margin: CullMargin) -> SpatialIndexStats {
        SpatialIndexStats { total: self.entries.len(), indexed: self.entries.len(), visible: self.query_viewport(viewport, margin).node_ids.len() }
    }
}
