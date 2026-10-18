import { describe, expect, it } from 'vitest'
import { currentDocument, dispatchEditorCommand } from '../commandBus.ts'
import { undoTransaction } from '../transactions.ts'

describe('vector undo', () => {
  it('restores anchors, handles, fill rule, visibility, and selection', () => {
    dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'undo-path', x: 1, y: 1 })
    const before = structuredClone(currentDocument().vectorPaths['undo-path'])
    dispatchEditorCommand({ type: 'moveAnchorPoint', pathId: 'undo-path', anchorId: 'undo-path-a1', x: 9, y: 9 })
    const restored = undoTransaction(currentDocument())
    expect(restored.vectorPaths['undo-path']?.anchors).toEqual(before?.anchors)
    expect(restored.vectorPaths['undo-path']?.fillRule).toBe('nonzero')
    expect(restored.vectorPaths['undo-path']?.visible).toBe(true)
    expect(restored.selectedPointId).toBe(before ? 'undo-path-a1' : null)
  })
})
