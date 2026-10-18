import { describe, expect, it } from 'vitest'
import { resolveConstraint } from '../constraints.ts'

const child = { x: 10, y: 12, width: 20, height: 8 }
const before = { x: 0, y: 0, width: 100, height: 50 }
const after = { x: 0, y: 0, width: 200, height: 80 }

describe('constraints', () => {
  it('resolves left, right, top, bottom, center, scale, fixed, and stretch', () => {
    expect(resolveConstraint(child, before, after, 'left').x).toBe(10)
    expect(resolveConstraint(child, before, after, 'right').x).toBe(110)
    expect(resolveConstraint(child, before, after, 'top').y).toBe(12)
    expect(resolveConstraint(child, before, after, 'bottom').y).toBe(42)
    expect(resolveConstraint(child, before, after, 'center').x).toBe(90)
    expect(resolveConstraint(child, before, after, 'scale').width).toBe(40)
    expect(resolveConstraint(child, before, after, 'fixed').x).toBe(10)
    expect(resolveConstraint(child, before, after, 'stretch').width).toBe(200)
    expect(Number.isNaN(resolveConstraint(child, before, { ...after, width: 0, height: 0 }, 'center').x)).toBe(false)
  })
})
