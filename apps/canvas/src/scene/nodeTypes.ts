export interface SceneNode {
  id: string
  kind: 'page' | 'frame' | 'shape' | 'group' | 'image'
  parentId: string | null
  childIds: string[]
  x: number
  y: number
  width: number
  height: number
  zOrder: number
  fill: string
  locked: boolean
}

export interface SceneDocument {
  nodes: Record<string, SceneNode>
}
