import { describe, expect, it } from 'vitest'
import { currentDocument, dispatchEditorCommand } from '../commandBus.ts'

describe('vector commands', () => {
  it('edits anchors and boolean operations deterministically', () => {
    dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'pen', x: 1, y: 2 })
    dispatchEditorCommand({ type: 'moveAnchorPoint', pathId: 'pen', anchorId: 'pen-a1', x: 3, y: 4 })
    dispatchEditorCommand({ type: 'updateBezierHandle', pathId: 'pen', anchorId: 'pen-a1', handle: 'out', x: 5, y: 6 })
    dispatchEditorCommand({ type: 'closeVectorPath', pathId: 'pen' })
    dispatchEditorCommand({ type: 'convertSegmentType', pathId: 'pen', anchorId: 'pen-a1', segmentType: 'curve' })
    dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'pen', x: 8, y: 9 })
    dispatchEditorCommand({ type: 'splitVectorPath', pathId: 'pen', anchorId: 'pen-a2' })
    dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'join-b', x: 1, y: 1 })
    const joined = dispatchEditorCommand({ type: 'joinVectorPaths', leftId: 'pen', rightId: 'join-b' })
    expect(joined.status).toBe('ok')
    dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'left', x: 0, y: 0 })
    dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'right', x: 10, y: 0 })
    expect(dispatchEditorCommand({ type: 'booleanUnion', leftId: 'left', rightId: 'right' }).status).toBe('ok')
    expect(dispatchEditorCommand({ type: 'booleanSubtract', leftId: 'left', rightId: 'right' }).status).toBe('ok')
    expect(dispatchEditorCommand({ type: 'booleanIntersect', leftId: 'left', rightId: 'right' }).status).toBe('ok')
    expect(dispatchEditorCommand({ type: 'booleanExclude', leftId: 'left', rightId: 'right' }).status).toBe('ok')
    const path = currentDocument().vectorPaths.pen
    expect(path?.closed).toBe(true)
    expect(path?.anchors[0]?.segmentType).toBe('curve')
  })
})
