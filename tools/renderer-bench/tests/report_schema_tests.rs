#[test]
fn validates_report_thresholds() {
    let report = renderer_bench::report::RendererBenchReport { backend: "webgpu".into(), layer_count: 50000, load_time_ms: 12, average_fps: 60.0, frame_time_p50_ms: 8.0, frame_time_p95_ms: 16.0, peak_memory_mb: 256.0 };
    let json = serde_json::to_string(&report).unwrap();
    assert!(json.contains("average_fps"));
    assert!(renderer_bench::report::passes(&report));
}
