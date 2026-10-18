export interface CrdtOperationMetrics {
  operationType: string
  updateBytes: number
  appliedUpdates: number
  rejectedUpdates: number
  durationMs: number
}

export interface SemanticMergeIssue {
  code: 'semantic_conflict'
  type?: 'unsafe_undo_target_deleted'
  nodeId: string
}

export interface CrdtSnapshot {
  schemaVersion: string
  nodes: Record<string, { parentId: string | null; zIndex: number; x: number; y: number }>
}

export interface SceneOperation {
  type: 'createFrame' | 'createShape' | 'updateTransform' | 'moveNode' | 'deleteNode'
  nodeId: string
  parentId: string | null
  zIndex: number
  x: number
  y: number
}

export interface CrdtAdapter {
  applySceneOperation(operation: SceneOperation, scope: { documentId: string; actorId?: string; clientId?: string; transactionGroupId?: string }): {
    update: Uint8Array
    snapshotVersion: string
    metrics: CrdtOperationMetrics
  }
  applyRemoteUpdate(update: Uint8Array, source: string): { applied: boolean; conflicts: SemanticMergeIssue[]; metrics: CrdtOperationMetrics }
  encodeUpdate(): Uint8Array
  encodeStateVector(): Uint8Array
  exportSnapshot(): CrdtSnapshot
  importSnapshot(snapshot: unknown): void
  onMetrics(listener: (metrics: CrdtOperationMetrics) => void): void
}
