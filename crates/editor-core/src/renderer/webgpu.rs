use super::{GpuUploadPlan, MaterialKey, RenderDeltaBatch, RenderPrimitive, RendererBackendStatus};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WebGpuBatch {
    pub material: MaterialKey,
    pub opacity: u8,
    pub blend_mode: String,
    pub texture_atlas_id: String,
    pub primitive_count: usize,
}

pub struct WebGpuRenderer;

impl WebGpuRenderer {
    pub fn new(gpu_available: bool) -> Result<Self, RendererBackendStatus> {
        if gpu_available {
            Ok(Self)
        } else {
            Err(RendererBackendStatus::Unavailable)
        }
    }
}

pub fn build_webgpu_batches(batch: &RenderDeltaBatch) -> Vec<WebGpuBatch> {
    let mut grouped: Vec<WebGpuBatch> = Vec::new();
    for primitive in &batch.primitives {
        if let Some(existing) = grouped.iter_mut().find(|item| same_webgpu_key(item, primitive)) {
            existing.primitive_count += 1;
        } else {
            grouped.push(WebGpuBatch {
                material: primitive.material.clone(),
                opacity: primitive.opacity,
                blend_mode: primitive.blend_mode.clone(),
                texture_atlas_id: primitive.texture_atlas_id.clone(),
                primitive_count: 1,
            });
        }
    }
    grouped
}

fn same_webgpu_key(batch: &WebGpuBatch, primitive: &RenderPrimitive) -> bool {
    batch.material == primitive.material && batch.opacity == primitive.opacity && batch.blend_mode == primitive.blend_mode && batch.texture_atlas_id == primitive.texture_atlas_id
}

pub fn updates_gpu_upload_plan_from_render_deltas(batch: &RenderDeltaBatch) -> GpuUploadPlan {
    let batches = build_webgpu_batches(batch);
    GpuUploadPlan { batch_count: batches.len(), primitive_count: batch.primitives.len() }
}
