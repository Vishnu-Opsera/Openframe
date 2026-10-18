import { describe, expect, it } from 'vitest'
import { dispatchEditorCommand } from '../commandBus.ts'

describe('text command validation', () => {
  it('rejects invalid axes, ranges, and missing nodes', () => {
    const created = dispatchEditorCommand({ type: 'createTextNode', parentId: 'page', content: 'Hi' })
    expect(created.status).toBe('ok')
    expect(dispatchEditorCommand({ type: 'updateVariableFontAxis', nodeId: 'text-1', tag: 'zzzz', value: 400 }).errors[0]?.code).toBe('invalid_axis_tag')
    expect(dispatchEditorCommand({ type: 'updateVariableFontAxis', nodeId: 'text-1', tag: 'wght', value: 5000 }).errors[0]?.code).toBe('axis_out_of_range')
    expect(dispatchEditorCommand({ type: 'updateTextRangeStyle', nodeId: 'text-1', start: 0, end: 20, fontSize: 12 }).errors[0]?.code).toBe('invalid_range')
    expect(dispatchEditorCommand({ type: 'updateTextContent', nodeId: 'missing', content: 'x', confirmed: true }).errors[0]?.code).toBe('missing_text_node')
  })
})
