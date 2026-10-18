use editor_core::renderer::webgpu::{build_webgpu_batches, updates_gpu_upload_plan_from_render_deltas as plan_from_deltas, WebGpuRenderer};
use editor_core::renderer::{MaterialKey, RenderDeltaBatch, RenderPrimitive, RendererBackendStatus};

fn sample() -> RenderDeltaBatch {
    RenderDeltaBatch {
        primitives: vec![
            primitive("red", "none", 255, "src-over", "atlas-a"),
            primitive("red", "none", 255, "src-over", "atlas-a"),
            primitive("red", "none", 128, "src-over", "atlas-a"),
            primitive("blue", "black", 255, "multiply", "atlas-b"),
        ],
    }
}

fn primitive(fill: &str, stroke: &str, opacity: u8, blend: &str, atlas: &str) -> RenderPrimitive {
    RenderPrimitive {
        material: MaterialKey { fill: fill.to_string(), stroke: stroke.to_string() },
        opacity,
        blend_mode: blend.to_string(),
        texture_atlas_id: atlas.to_string(),
    }
}

#[test]
fn webgpu_batch_builder() {
    assert_eq!(build_webgpu_batches(&sample()).len(), 3);
}

#[test]
fn batches_by_material_and_opacity() {
    let batches = build_webgpu_batches(&sample());
    assert_eq!(batches[0].primitive_count, 2);
    assert_eq!(batches[1].opacity, 128);
}

#[test]
fn updates_gpu_upload_plan_from_render_deltas() {
    let plan = plan_from_deltas(&sample());
    assert_eq!(plan.batch_count, 3);
    assert_eq!(plan.primitive_count, 4);
    assert!(matches!(WebGpuRenderer::new(false), Err(RendererBackendStatus::Unavailable)));
    assert!(WebGpuRenderer::new(true).is_ok());
}
