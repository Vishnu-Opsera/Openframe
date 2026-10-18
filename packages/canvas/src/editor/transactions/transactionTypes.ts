export interface TransactionOrigin {
  actorId: string
  clientId: string
  transactionGroupId: string
  scopeName: string
  localSequence: number
}

export interface InverseSceneOperation {
  type: 'createFrame' | 'deleteNode' | 'updateTransform'
  nodeId: string
  parentId: string | null
  zIndex: number
  x: number
  y: number
}

export interface LocalUndoEntry {
  actorId: string
  clientId: string
  transactionGroupId: string
  scopeName: string
  localSequence: number
  inverseOperations: InverseSceneOperation[]
}

export interface CollaborativeUndoResult {
  applied: boolean
  conflict: { type: 'unsafe_undo_target_deleted'; nodeId: string } | null
  counters: { undo_requested: number; undo_applied: number; undo_conflict: number; redo_requested: number; redo_applied: number }
}
