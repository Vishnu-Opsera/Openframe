export function parsePdfToSceneGraph(name: string): { operations: Array<{ type: string; nodeId: string }> } {
  return { operations: [{ type: 'frame', nodeId: `${name}-page-1` }, { type: 'frame', nodeId: `${name}-page-2` }] }
}
