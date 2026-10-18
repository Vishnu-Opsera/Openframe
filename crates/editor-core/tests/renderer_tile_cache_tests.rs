use editor_core::renderer::tile_cache::{DirtyRegionTracker, GpuTileCache};

#[test]
fn renderer_tile_cache() {
    let mut tracker = DirtyRegionTracker::default();
    tracker.apply_deltas(&[(0, 0, 10, 10)]);
    assert_eq!(tracker.dirty.len(), 1);
}

#[test]
fn renderer_tile_cache_eviction() {
    let mut cache = GpuTileCache::new(10);
    cache.insert("a", 8);
    cache.insert("b", 8);
    assert_eq!(cache.enforce_budget(), vec!["a".to_string()]);
}

#[test]
fn marks_dirty_tiles_from_deltas() {
    let mut tracker = DirtyRegionTracker::default();
    tracker.apply_deltas(&[(0, 0, 1, 1), (20, 20, 2, 2)]);
    assert_eq!(tracker.dirty.len(), 2);
}

#[test]
fn preserves_clean_static_tiles() {
    let mut tracker = DirtyRegionTracker::default();
    tracker.apply_deltas(&[(0, 0, 1, 1)]);
    assert!(tracker.clean.iter().any(|tile| tile.0 == "static-background"));
}

#[test]
fn evicts_lru_tiles_over_budget() {
    let mut cache = GpuTileCache::new(12);
    cache.insert("old", 8);
    cache.insert("new", 8);
    cache.touch("new");
    let evicted = cache.enforce_budget();
    assert_eq!(evicted, vec!["old".to_string()]);
    assert!(cache.estimated_texture_bytes() <= 12);
}
