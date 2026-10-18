use editor_core::renderer::webgl2::{build_webgl2_batches, converts_render_deltas_to_gl_upload_plan as gl_upload_plan, WebGl2Renderer};
use editor_core::renderer::{MaterialKey, RenderDeltaBatch, RenderPrimitive, RendererBackendStatus};

fn sample() -> RenderDeltaBatch {
    RenderDeltaBatch {
        primitives: vec![
            primitive("red", "none", 255, "src-over"),
            primitive("red", "none", 255, "src-over"),
            primitive("blue", "black", 200, "multiply"),
        ],
    }
}

fn primitive(fill: &str, stroke: &str, opacity: u8, blend: &str) -> RenderPrimitive {
    RenderPrimitive {
        material: MaterialKey { fill: fill.to_string(), stroke: stroke.to_string() },
        opacity,
        blend_mode: blend.to_string(),
        texture_atlas_id: "atlas".to_string(),
    }
}

#[test]
fn webgl2_batch_builder() {
    assert_eq!(build_webgl2_batches(&sample()).len(), 2);
}

#[test]
fn batches_by_material_for_webgl2() {
    assert_eq!(build_webgl2_batches(&sample())[0].primitive_count, 2);
}

#[test]
fn converts_render_deltas_to_gl_upload_plan() {
    let plan = gl_upload_plan(&sample());
    assert_eq!(plan.primitive_count, 3);
    assert!(matches!(WebGl2Renderer::new(false), Err(RendererBackendStatus::Unavailable)));
}
