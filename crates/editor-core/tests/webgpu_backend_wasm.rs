use editor_core::renderer::webgpu::WebGpuRenderer;
use editor_core::renderer::RendererBackendStatus;

#[test]
fn webgpu_backend_reports_unavailable_without_gpu() {
    assert!(matches!(WebGpuRenderer::new(false), Err(RendererBackendStatus::Unavailable)));
}
