import { describe, expect, it } from 'vitest'
import { layoutFlex, layoutGrid } from '../layout.ts'

const children = [
  { id: 'a', width: 20, height: 10, sizing: 'fixed' as const },
  { id: 'b', width: 20, height: 10, sizing: 'stretch' as const },
]

describe('auto layout', () => {
  it('places flex rows, columns, wrapped items, and grid tracks', () => {
    const row = layoutFlex({ direction: 'row', wrap: false, padding: 8, gap: 4, alignment: 'start', containerWidth: 200, containerHeight: 40, children })
    const column = layoutFlex({ direction: 'column', wrap: false, padding: 8, gap: 4, alignment: 'center', containerWidth: 80, containerHeight: 120, children })
    const wrapped = layoutFlex({ direction: 'row', wrap: true, padding: 0, gap: 4, alignment: 'end', containerWidth: 30, containerHeight: 40, children })
    const grid = layoutGrid({ columns: 2, padding: 8, gap: 4, containerWidth: 100, children })
    expect(Array.isArray(row) ? row[0]?.x : 0).toBe(8)
    const columnItems = Array.isArray(column) ? column : []
    const gridItems = Array.isArray(grid) ? grid : []
    const wrappedItems = Array.isArray(wrapped) ? wrapped : []
    expect(columnItems[1]?.y ?? 0).toBeGreaterThan(columnItems[0]?.y ?? 0)
    expect(wrappedItems[1]?.y ?? 0).toBeGreaterThan(0)
    expect(gridItems[1]?.x ?? 0).toBeGreaterThan(gridItems[0]?.x ?? 0)
    expect(layoutFlex({ direction: 'row', wrap: false, padding: 0, gap: -1, alignment: 'start', containerWidth: 0, containerHeight: 0, children })).toEqual({ error: 'negative_spacing' })
    expect(layoutGrid({ columns: 0, padding: 0, gap: 0, containerWidth: 0, children })).toEqual({ error: 'invalid_track' })
  })
})
