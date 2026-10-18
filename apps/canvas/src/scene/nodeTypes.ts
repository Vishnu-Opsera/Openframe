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
  constraint: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'scale' | 'fixed' | 'stretch'
  layoutMode: 'none' | 'flex' | 'grid'
  dirty: boolean
}

export interface SceneDocument {
  nodes: Record<string, SceneNode>
  vectorPaths: Record<string, import('./vectorPath.ts').VectorPathNode>
  textNodes: Record<string, import('./textNode.ts').TextNode>
  selectedPointId: string | null
}
