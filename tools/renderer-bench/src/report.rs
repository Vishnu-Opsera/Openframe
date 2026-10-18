use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct RendererBenchReport {
    pub backend: String,
    pub layer_count: u32,
    pub load_time_ms: u32,
    pub average_fps: f32,
    pub frame_time_p50_ms: f32,
    pub frame_time_p95_ms: f32,
    pub peak_memory_mb: f32,
}
pub fn passes(report: &RendererBenchReport) -> bool { report.average_fps >= 1.0 && report.load_time_ms > 0 && report.peak_memory_mb < 4096.0 }
