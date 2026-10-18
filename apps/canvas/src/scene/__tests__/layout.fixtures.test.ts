import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('layout fixtures', () => {
  it('loads flex and constraint scenes', () => {
    const flex = JSON.parse(readFileSync('fixtures/canvas/layout-flex-grid.canvas.json', 'utf8')) as { mode: string }
    const constraints = JSON.parse(readFileSync('fixtures/canvas/constraints-resize.canvas.json', 'utf8')) as { constraint: string }
    expect(flex.mode).toBe('flex')
    expect(constraints.constraint).toBe('right')
  })
})
