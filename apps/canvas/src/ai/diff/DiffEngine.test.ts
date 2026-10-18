import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { diffProposal } from './DiffEngine.ts'
describe('diff engine', () => {
  it('returns supported operations and rejects malformed json', () => {
    for (const name of ['basic-card-edit.proposal.json', 'unsupported-operation.proposal.json', 'malformed-proposal.json', 'base-dashboard.canvas.json']) {
      expect(readFileSync(`fixtures/ai/diff/${name}`, 'utf8').length).toBeGreaterThan(0)
    }
    const proposal = JSON.parse(readFileSync('fixtures/ai/diff/basic-card-edit.proposal.json', 'utf8')) as { operations: Array<{ type: string; operationId: string }> }
    const graph = JSON.parse(readFileSync('fixtures/ai/diff/base-dashboard.canvas.json', 'utf8'))
    const before = JSON.stringify(graph)
    const review = diffProposal({ proposal, graph })
    if ('error' in review) throw new Error('expected review')
    expect(review.operations.map((operation) => operation.type)).toEqual(['createNode', 'updateNode', 'deleteNode', 'moveNode', 'updateTokenRef', 'updateConstraint'])
    const malformed = diffProposal({ proposal: { invalid: true }, graph })
    expect('error' in malformed && malformed.error.code).toBe('INVALID_PROPOSAL_JSON')
    expect(JSON.stringify(graph)).toBe(before)
    const unsupported = diffProposal({ proposal: JSON.parse(readFileSync('fixtures/ai/diff/unsupported-operation.proposal.json', 'utf8')), graph })
    if ('error' in unsupported) throw new Error('expected review')
    expect(unsupported.unsupportedOperations[0]?.message).toBe('unsupported')
  })
})
