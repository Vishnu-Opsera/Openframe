export function inverseDurableOperation(operation: DurableSceneOperation): DurableSceneOperation {
  if (operation.type === 'createFrame' || operation.type === 'createShape') {
    return { ...operation, type: 'deleteNode' }
  }
  if (operation.type === 'deleteNode') {
    return { ...operation, type: 'createFrame' }
  }
  return { ...operation, type: 'updateTransform' }
}

export function undoTargetDeleted(nodeExists: boolean): boolean {
  return !nodeExists
}

export interface DurableSceneOperation {
  type: 'createFrame' | 'createShape' | 'updateTransform' | 'moveNode' | 'deleteNode'
  nodeId: string
  parentId: string | null
  zIndex: number
  x: number
  y: number
  metadata: string
}
