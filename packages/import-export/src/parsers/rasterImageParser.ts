export function parseRasterImageToSceneGraph(name: string, mimeType: string): { nodeId: string; assetRef: string; width: number; height: number; mimeType: string } {
  return { nodeId: `image-${name}`, assetRef: `asset://${name}`, width: 2, height: 2, mimeType }
}
