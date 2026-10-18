use super::{GpuUploadPlan, RenderDeltaBatch, RenderPrimitive, RendererBackendStatus};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WebGl2Batch {
    pub fill: String,
    pub stroke: String,
    pub opacity: u8,
    pub blend_mode: String,
    pub primitive_count: usize,
}

pub struct WebGl2Renderer;

impl WebGl2Renderer {
    pub fn new(context_available: bool) -> Result<Self, RendererBackendStatus> {
        if context_available {
            Ok(Self)
        } else {
            Err(RendererBackendStatus::Unavailable)
        }
    }
}

pub fn build_webgl2_batches(batch: &RenderDeltaBatch) -> Vec<WebGl2Batch> {
    let mut grouped: Vec<WebGl2Batch> = Vec::new();
    for primitive in &batch.primitives {
        if let Some(existing) = grouped.iter_mut().find(|item| same_webgl_key(item, primitive)) {
            existing.primitive_count += 1;
        } else {
            grouped.push(WebGl2Batch {
                fill: primitive.material.fill.clone(),
                stroke: primitive.material.stroke.clone(),
                opacity: primitive.opacity,
                blend_mode: primitive.blend_mode.clone(),
                primitive_count: 1,
            });
        }
    }
    grouped
}

fn same_webgl_key(batch: &WebGl2Batch, primitive: &RenderPrimitive) -> bool {
    batch.fill == primitive.material.fill && batch.stroke == primitive.material.stroke && batch.opacity == primitive.opacity && batch.blend_mode == primitive.blend_mode
}

pub fn converts_render_deltas_to_gl_upload_plan(batch: &RenderDeltaBatch) -> GpuUploadPlan {
    let batches = build_webgl2_batches(batch);
    GpuUploadPlan { batch_count: batches.len(), primitive_count: batch.primitives.len() }
}
