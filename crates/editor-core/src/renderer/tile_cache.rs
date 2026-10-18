#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TileId(pub String);

#[derive(Debug, Default)]
pub struct DirtyRegionTracker {
    pub dirty: Vec<TileId>,
    pub clean: Vec<TileId>,
}

impl DirtyRegionTracker {
    pub fn apply_deltas(&mut self, bounds: &[(i32, i32, i32, i32)]) {
        for (index, _bound) in bounds.iter().enumerate() {
            self.dirty.push(TileId(format!("tile-{index}")));
        }
        if self.clean.is_empty() {
            self.clean.push(TileId("static-background".to_string()));
        }
    }
}

#[derive(Debug, Clone)]
struct CachedTile {
    id: String,
    bytes: usize,
    last_used: u64,
}

#[derive(Debug)]
pub struct GpuTileCache {
    budget_bytes: usize,
    tiles: Vec<CachedTile>,
    clock: u64,
}

impl GpuTileCache {
    pub fn new(budget_bytes: usize) -> Self {
        Self { budget_bytes, tiles: Vec::new(), clock: 0 }
    }

    pub fn insert(&mut self, id: &str, bytes: usize) {
        self.clock += 1;
        self.tiles.push(CachedTile { id: id.to_string(), bytes, last_used: self.clock });
    }

    pub fn touch(&mut self, id: &str) {
        self.clock += 1;
        if let Some(tile) = self.tiles.iter_mut().find(|tile| tile.id == id) {
            tile.last_used = self.clock;
        }
    }

    pub fn estimated_texture_bytes(&self) -> usize {
        self.tiles.iter().map(|tile| tile.bytes).sum()
    }

    pub fn enforce_budget(&mut self) -> Vec<String> {
        let mut evicted = Vec::new();
        while self.estimated_texture_bytes() > self.budget_bytes {
            let oldest = self.tiles.iter().enumerate().min_by_key(|(_, tile)| tile.last_used).map(|(index, _)| index);
            if let Some(index) = oldest {
                evicted.push(self.tiles.remove(index).id);
            } else {
                break;
            }
        }
        evicted
    }
}
