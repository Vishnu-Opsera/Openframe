import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { collectScopedContext } from './ScopedContextCollector.ts'
describe('scoped context', () => {
  it('collects a card selection and rejects an empty selection', () => {
    const card = JSON.parse(readFileSync('fixtures/ai/scoped-context/card-selection.canvas.json', 'utf8')) as { selectedNodeIds: string[]; rootNodeId: string; tokenRefs: string[]; componentRefs: string[]; constraintRefs: string[] }
    const empty = JSON.parse(readFileSync('fixtures/ai/scoped-context/empty-selection.canvas.json', 'utf8')) as { selectedNodeIds: string[]; rootNodeId: string }
    readFileSync('fixtures/ai/scoped-context/detached-instance.canvas.json', 'utf8')
    readFileSync('fixtures/ai/scoped-context/missing-token.canvas.json', 'utf8')
    const context = collectScopedContext(card)
    if ('error' in context) throw new Error('expected context')
    expect(context.boundary.rootNodeId).toBe(card.rootNodeId)
    const rejected = collectScopedContext(empty)
    expect('error' in rejected && rejected.error.code).toBe('EMPTY_SELECTION')
  })
})
