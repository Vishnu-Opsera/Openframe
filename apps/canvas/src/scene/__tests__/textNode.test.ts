import { describe, expect, it } from 'vitest'
import { createTextNode } from '../textNode.ts'

describe('text node', () => {
  it('stores content, runs, font metadata, paragraph style, overflow, and bounds', () => {
    const node = createTextNode('text-1', 'Openframe')
    expect(node.content).toBe('Openframe')
    expect(node.runs[0]?.font.fontFamily).toBe('Inter')
    expect(node.runs[0]?.font.fontStyle).toBe('Regular')
    expect(node.runs[0]?.font.variableAxes[0]?.tag).toBe('wght')
    expect(node.runs[0]?.font.features[0]?.tag).toBe('liga')
    expect(node.runs[0]?.fontSize).toBe(16)
    expect(node.paragraph.lineHeight).toBe(20)
    expect(node.paragraph.letterSpacing).toBe(0)
    expect(node.paragraph.alignment).toBe('left')
    expect(node.overflow).toBe('visible')
    expect(node.bounds.width).toBe(160)
  })
})
