use editor_core::renderer::webgl2::WebGl2Renderer;
use editor_core::renderer::RendererBackendStatus;

#[test]
fn webgl2_backend_reports_unavailable_without_context() {
    assert!(matches!(WebGl2Renderer::new(false), Err(RendererBackendStatus::Unavailable)));
}
