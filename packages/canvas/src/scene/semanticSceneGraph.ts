export interface DurableSceneOperation {
  type: 'createFrame' | 'createShape' | 'updateTransform' | 'moveNode' | 'deleteNode'
  nodeId: string
  parentId: string | null
  zIndex: number
  x: number
  y: number
  metadata: string
}
