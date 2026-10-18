use editor_core::renderer::culling::{CullMargin, IndexDelta, RenderBounds, SpatialIndex, ViewportRect};

fn bounds(id: &str, x: f32, y: f32) -> RenderBounds {
    RenderBounds { node_id: id.to_string(), x, y, width: 10.0, height: 10.0 }
}

#[test]
fn renderer_culling() {
    let mut index = SpatialIndex::default();
    index.apply_deltas(&[IndexDelta::Insert(bounds("a", 0.0, 0.0)), IndexDelta::Insert(bounds("b", 500.0, 500.0))]);
    let visible = index.query_viewport(ViewportRect { x: 0.0, y: 0.0, width: 100.0, height: 100.0 }, CullMargin { pixels: 0.0 });
    assert_eq!(visible.node_ids, vec!["a".to_string()]);
}

#[test]
fn renderer_culling_updates() {
    let mut index = SpatialIndex::default();
    index.apply_deltas(&[IndexDelta::Insert(bounds("a", 0.0, 0.0))]);
    index.apply_deltas(&[IndexDelta::Update(bounds("a", 400.0, 400.0)), IndexDelta::Delete("missing".to_string())]);
    assert!(index.query_viewport(ViewportRect { x: 0.0, y: 0.0, width: 50.0, height: 50.0 }, CullMargin { pixels: 0.0 }).node_ids.is_empty());
}

#[test]
fn queries_visible_bounds() {
    let mut index = SpatialIndex::default();
    index.apply_deltas(&[IndexDelta::Insert(bounds("near", 10.0, 10.0))]);
    assert_eq!(index.query_viewport(ViewportRect { x: 0.0, y: 0.0, width: 30.0, height: 30.0 }, CullMargin { pixels: 0.0 }).node_ids.len(), 1);
}

#[test]
fn updates_index_from_render_deltas() {
    let mut index = SpatialIndex::default();
    index.apply_deltas(&[IndexDelta::Insert(bounds("gone", 1.0, 1.0))]);
    index.apply_deltas(&[IndexDelta::Delete("gone".to_string())]);
    assert_eq!(index.stats(ViewportRect { x: 0.0, y: 0.0, width: 10.0, height: 10.0 }, CullMargin { pixels: 0.0 }).indexed, 0);
}

#[test]
fn handles_negative_scene_coordinates() {
    let mut index = SpatialIndex::default();
    index.apply_deltas(&[IndexDelta::Insert(bounds("neg", -40.0, -40.0))]);
    let visible = index.query_viewport(ViewportRect { x: -50.0, y: -50.0, width: 20.0, height: 20.0 }, CullMargin { pixels: 0.0 });
    assert_eq!(visible.node_ids, vec!["neg".to_string()]);
}
