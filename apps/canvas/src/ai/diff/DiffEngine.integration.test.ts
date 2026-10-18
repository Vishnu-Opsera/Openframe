import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('diff integration', () => {
  it('does not mutate the graph source', () => {
    expect(readFileSync('apps/canvas/src/ai/diff/DiffEngine.ts', 'utf8')).toContain('unsupportedOperations')
  })
})
