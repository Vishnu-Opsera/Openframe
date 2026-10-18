import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('vector fixtures', () => {
  it('loads boolean operands and an open pen path', () => {
    const operands = JSON.parse(readFileSync('fixtures/canvas/vector-boolean-operands.canvas.json', 'utf8')) as { paths: { left: { anchors: unknown[] } } }
    const openPath = JSON.parse(readFileSync('fixtures/canvas/vector-pen-open-path.canvas.json', 'utf8')) as { closed: boolean }
    expect(operands.paths.left.anchors.length).toBeGreaterThan(0)
    expect(openPath.closed).toBe(false)
  })
})
