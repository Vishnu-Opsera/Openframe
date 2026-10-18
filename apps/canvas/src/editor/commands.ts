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
  | { type: 'addAnchorPoint'; pathId: string; x: number; y: number }
  | { type: 'moveAnchorPoint'; pathId: string; anchorId: string; x: number; y: number }
  | { type: 'updateBezierHandle'; pathId: string; anchorId: string; handle: 'in' | 'out'; x: number; y: number }
  | { type: 'closeVectorPath'; pathId: string }
  | { type: 'splitVectorPath'; pathId: string; anchorId: string }
  | { type: 'joinVectorPaths'; leftId: string; rightId: string }
  | { type: 'convertSegmentType'; pathId: string; anchorId: string; segmentType: 'line' | 'curve' }
  | { type: 'booleanUnion'; leftId: string; rightId: string }
  | { type: 'booleanSubtract'; leftId: string; rightId: string }
  | { type: 'booleanIntersect'; leftId: string; rightId: string }
  | { type: 'booleanExclude'; leftId: string; rightId: string }
  | { type: 'createTextNode'; parentId: string; content: string }
  | { type: 'updateTextContent'; nodeId: string; content: string; confirmed: boolean }
  | { type: 'updateTextRangeStyle'; nodeId: string; start: number; end: number; fontSize: number }
  | { type: 'updateParagraphStyle'; nodeId: string; alignment: 'left' | 'center' | 'right' }
  | { type: 'updateVariableFontAxis'; nodeId: string; tag: string; value: number }
  | { type: 'updateConstraints'; nodeId: string; constraint: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'scale' | 'fixed' | 'stretch' }
  | { type: 'enableAutoLayout'; nodeId: string; mode: 'none' | 'flex' | 'grid' }
  | { type: 'updateFlexLayout'; nodeId: string; direction: 'row' | 'column'; wrap: boolean; padding: number; gap: number }
  | { type: 'updateGridLayout'; nodeId: string; columns: number; padding: number; gap: number }
  | { type: 'reorderAutoLayoutChild'; nodeId: string; childId: string; index: number }
  | { type: 'resizeAutoLayoutFrame'; nodeId: string; width: number; height: number }
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
