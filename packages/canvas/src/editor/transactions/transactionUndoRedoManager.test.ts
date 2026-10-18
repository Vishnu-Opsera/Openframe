import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { TransactionUndoRedoManager } from './transactionUndoRedoManager.ts'

describe('collaborative undo manager', () => {
  it('groups local scopes and reports a deleted-target conflict', () => {
    const fixture = JSON.parse(readFileSync('packages/canvas/test-fixtures/undo/collaborative-undo-scenarios.json', 'utf8')) as { scenarios: string[] }
    expect(fixture.scenarios).toContain('undo conflict')
    const manager = new TransactionUndoRedoManager()
    const scope = manager.beginTransactionScope({ actorId: 'A', clientId: 'client-a', transactionGroupId: 'group-1', scopeName: 'create' })
    expect(scope.localSequence).toBe(1)
    manager.commitTransactionScope(scope, [{ type: 'deleteNode', nodeId: 'frame-1', parentId: null, zIndex: 0, x: 0, y: 0 }])
    manager.noteRemoteDelete('frame-1')
    const undone = manager.undoLocalScope('A')
    expect(undone.conflict?.type).toBe('unsafe_undo_target_deleted')
    const redoScope = manager.beginTransactionScope({ actorId: 'A', clientId: 'client-a', transactionGroupId: 'group-2', scopeName: 'move' })
    manager.commitTransactionScope(redoScope, [{ type: 'updateTransform', nodeId: 'frame-2', parentId: 'page', zIndex: 1, x: 4, y: 4 }])
    expect(manager.undoLocalScope('A').applied).toBe(true)
    expect(manager.redoLocalScope('A').applied).toBe(true)
  })
})
