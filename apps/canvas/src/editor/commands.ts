export type EditorCommand =
  | { type: 'createFrame'; parentId: string; width: number; height: number }
  | { type: 'createShape'; parentId: string; width: number; height: number }
  | { type: 'createGroup'; parentId: string; childIds: string[] }
  | { type: 'placeImage'; parentId: string; mimeType: string; width: number; height: number }
  | { type: 'groupSelection'; parentId: string; childIds: string[] }
  | { type: 'ungroupSelection'; groupId: string }
  | { type: 'deleteSelection'; nodeIds: string[] }
  | { type: 'reorderNode'; nodeId: string; index: number }
  | { type: 'updateNodeTransform'; nodeId: string; x: number; y: number }
  | { type: 'updateNodeStyle'; nodeId: string; fill: string }
  | { type: 'undo' }
  | { type: 'redo' }

export interface CommandError {
  code: string
  message: string
  commandName: string
  recoverable: boolean
}

export interface EditorCommandResult {
  status: 'ok' | 'error'
  transactionId: string
  changedNodeIds: string[]
  renderDeltaId: string
  errors: CommandError[]
}
