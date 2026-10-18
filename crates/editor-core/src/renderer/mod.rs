pub mod webgl2;
pub mod webgpu;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MaterialKey {
    pub fill: String,
    pub stroke: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RenderPrimitive {
    pub material: MaterialKey,
    pub opacity: u8,
    pub blend_mode: String,
    pub texture_atlas_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RenderDeltaBatch {
    pub primitives: Vec<RenderPrimitive>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GpuUploadPlan {
    pub batch_count: usize,
    pub primitive_count: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RendererBackendStatus {
    Ready,
    Unavailable,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RendererDiagnostics {
    pub backend: String,
    pub fallback_reason: String,
}

pub fn select_backend(webgpu_available: bool, webgl2_available: bool) -> RendererDiagnostics {
    if webgpu_available {
        return RendererDiagnostics { backend: "webgpu".to_string(), fallback_reason: String::new() };
    }
    if webgl2_available {
        return RendererDiagnostics { backend: "webgl2".to_string(), fallback_reason: "webgpu_unavailable".to_string() };
    }
    RendererDiagnostics { backend: "none".to_string(), fallback_reason: "no_gpu_backend".to_string() }
}
