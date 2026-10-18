import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { diffProposal } from './DiffEngine.ts'
describe('scope integration', () => { it('blocks unrelated pages', () => { const proposal = JSON.parse(readFileSync('fixtures/ai/scope/unrelated-page-change.proposal.json', 'utf8')) as { operations: Array<{ type: string; operationId: string }>; unrelated: boolean }; const review = diffProposal({ proposal, graph: {} }); if ('error' in review) throw new Error('review'); expect(review.canAccept).toBe(false); expect(review.scopeImpact.reason).toBe('OUTSIDE_SELECTION_BOUNDARY') }) })
