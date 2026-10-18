export function exportPdf(model: { nodes: Array<{ name: string }> }): Uint8Array {
  return new TextEncoder().encode(`%PDF-1.4 ${model.nodes.map((node) => node.name).join(' ')}`)
}
