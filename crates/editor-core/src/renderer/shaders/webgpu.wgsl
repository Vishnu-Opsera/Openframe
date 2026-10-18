struct PrimitiveInput {
  position: vec2<f32>,
  color: vec4<f32>,
}

@vertex
fn vs_main(input: PrimitiveInput) -> @builtin(position) vec4<f32> {
  return vec4<f32>(input.position, 0.0, 1.0);
}
