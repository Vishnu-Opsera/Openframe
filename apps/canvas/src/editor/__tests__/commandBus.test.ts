import { describe, expect, it } from 'vitest'
import { currentDocument, dispatchEditorCommand } from '../commandBus.ts'

describe('command bus', () => {
  it('creates frames, shapes, images, groups, and transform updates', () => {
    const frame = dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: 100, height: 40 })
    const shape = dispatchEditorCommand({ type: 'createShape', parentId: 'page', width: 20, height: 20 })
    const image = dispatchEditorCommand({ type: 'placeImage', parentId: 'page', mimeType: 'image/png', width: 8, height: 8 })
    const group = dispatchEditorCommand({ type: 'groupSelection', parentId: 'page', childIds: [frame.changedNodeIds[0] ?? '', shape.changedNodeIds[0] ?? ''] })
    dispatchEditorCommand({ type: 'ungroupSelection', groupId: group.changedNodeIds[0] ?? '' })
    dispatchEditorCommand({ type: 'reorderNode', nodeId: image.changedNodeIds[0] ?? '', index: 0 })
    const moved = dispatchEditorCommand({ type: 'updateNodeTransform', nodeId: image.changedNodeIds[0] ?? '', x: 12, y: 4 })
    expect(frame.transactionId).toMatch(/^tx-/)
    expect(currentDocument().nodes[moved.changedNodeIds[0] ?? '']?.x).toBe(12)
    dispatchEditorCommand({ type: 'deleteSelection', nodeIds: [image.changedNodeIds[0] ?? ''] })
    expect(currentDocument().nodes[image.changedNodeIds[0] ?? '']).toBeUndefined()
  })
})
