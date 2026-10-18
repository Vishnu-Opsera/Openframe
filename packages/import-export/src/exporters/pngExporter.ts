export function exportPng(model: { nodes: Array<{ name: string }> }): Uint8Array {
  return new TextEncoder().encode(`PNG:${model.nodes.map((node) => node.name).join(',')}`)
}
