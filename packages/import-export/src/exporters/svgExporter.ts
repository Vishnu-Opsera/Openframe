export function exportSvg(model: { nodes: Array<{ name: string }> }): Uint8Array {
  const body = model.nodes.map((node) => `<g id="${node.name}"></g>`).join('')
  return new TextEncoder().encode(`<svg xmlns="http://www.w3.org/2000/svg">${body}</svg>`)
}
