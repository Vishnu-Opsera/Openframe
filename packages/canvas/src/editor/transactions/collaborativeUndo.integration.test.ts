import { describe, expect, it } from 'vitest'
import { createYjsCrdtAdapter } from '../../collaboration/yjsCrdtAdapter.ts'
import { TransactionUndoRedoManager } from './transactionUndoRedoManager.ts'

describe('collaborative undo integration', () => {
  it('keeps a remote transform when the author undoes the earlier create', () => {
    const actorA = createYjsCrdtAdapter()
    const actorB = createYjsCrdtAdapter()
    const manager = new TransactionUndoRedoManager()
    const created = actorA.applySceneOperation({ type: 'createFrame', nodeId: 'frame-1', parentId: 'page', zIndex: 0, x: 0, y: 0 }, { documentId: 'doc', actorId: 'A', clientId: 'a', transactionGroupId: 'g1' })
    actorB.applyRemoteUpdate(created.update, 'A')
    const transformed = actorB.applySceneOperation({ type: 'updateTransform', nodeId: 'frame-1', parentId: 'page', zIndex: 0, x: 30, y: 12 }, { documentId: 'doc', actorId: 'B', clientId: 'b', transactionGroupId: 'g2' })
    actorA.applyRemoteUpdate(transformed.update, 'B')
    const scope = manager.beginTransactionScope({ actorId: 'A', clientId: 'a', transactionGroupId: 'g1', scopeName: 'create' })
    manager.commitTransactionScope(scope, [{ type: 'deleteNode', nodeId: 'frame-1', parentId: null, zIndex: 0, x: 0, y: 0 }])
    manager.noteRemoteTransform('frame-1')
    expect(manager.undoLocalScope('A').applied).toBe(true)
    expect(actorA.exportSnapshot().nodes['frame-1']?.x).toBe(30)
    const deletedScope = manager.beginTransactionScope({ actorId: 'A', clientId: 'a', transactionGroupId: 'g3', scopeName: 'delete' })
    manager.commitTransactionScope(deletedScope, [{ type: 'deleteNode', nodeId: 'frame-1', parentId: null, zIndex: 0, x: 0, y: 0 }])
    manager.noteRemoteDelete('frame-1')
    actorA.applySceneOperation({ type: 'deleteNode', nodeId: 'missing', parentId: null, zIndex: 0, x: 0, y: 0 }, { documentId: 'doc', actorId: 'A' })
    const conflict = manager.undoLocalScope('A')
    expect(conflict.conflict?.type).toBe('unsafe_undo_target_deleted')
  })
})
