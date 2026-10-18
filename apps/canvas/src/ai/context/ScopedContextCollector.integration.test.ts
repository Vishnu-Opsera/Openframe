import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('scoped context integration', () => {
  it('does not import renderer modules', () => {
    const source = readFileSync('apps/canvas/src/ai/context/ScopedContextCollector.ts', 'utf8')
    expect(source).not.toContain('packages/renderer')
  })
})
