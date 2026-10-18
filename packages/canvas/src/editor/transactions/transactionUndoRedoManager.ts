import type { CollaborativeUndoResult, InverseSceneOperation, LocalUndoEntry, TransactionOrigin } from './transactionTypes.ts'

const counters = { undo_requested: 0, undo_applied: 0, undo_conflict: 0, redo_requested: 0, redo_applied: 0 }

export class TransactionUndoRedoManager {
  private readonly undo: LocalUndoEntry[] = []
  private readonly redo: LocalUndoEntry[] = []
  private sequence = 0
  private remoteTouched = new Set<string>()
  private deleted = new Set<string>()

  beginTransactionScope(origin: Omit<TransactionOrigin, 'localSequence'>): TransactionOrigin {
    this.sequence += 1
    return { ...origin, localSequence: this.sequence }
  }

  commitTransactionScope(origin: TransactionOrigin, inverseOperations: InverseSceneOperation[]): void {
    this.undo.push({ ...origin, inverseOperations })
    this.redo.length = 0
  }

  noteRemoteTransform(nodeId: string): void {
    this.remoteTouched.add(nodeId)
  }

  noteRemoteDelete(nodeId: string): void {
    this.deleted.add(nodeId)
  }

  undoLocalScope(actorId: string): CollaborativeUndoResult {
    counters.undo_requested += 1
    const entry = [...this.undo].reverse().find((item) => item.actorId === actorId)
    if (!entry) {
      return { applied: false, conflict: null, counters: { ...counters } }
    }
    const target = entry.inverseOperations[0]
    if (target && this.deleted.has(target.nodeId)) {
      counters.undo_conflict += 1
      return { applied: false, conflict: { type: 'unsafe_undo_target_deleted', nodeId: target.nodeId }, counters: { ...counters } }
    }
    if (target && this.remoteTouched.has(target.nodeId) && target.type === 'deleteNode') {
      counters.undo_applied += 1
      this.undo.splice(this.undo.lastIndexOf(entry), 1)
      this.redo.push(entry)
      return { applied: true, conflict: null, counters: { ...counters } }
    }
    this.undo.splice(this.undo.lastIndexOf(entry), 1)
    this.redo.push(entry)
    counters.undo_applied += 1
    return { applied: true, conflict: null, counters: { ...counters } }
  }

  redoLocalScope(actorId: string): CollaborativeUndoResult {
    counters.redo_requested += 1
    const entry = [...this.redo].reverse().find((item) => item.actorId === actorId)
    if (!entry) {
      return { applied: false, conflict: null, counters: { ...counters } }
    }
    this.redo.splice(this.redo.lastIndexOf(entry), 1)
    this.undo.push(entry)
    counters.redo_applied += 1
    return { applied: true, conflict: null, counters: { ...counters } }
  }
}
