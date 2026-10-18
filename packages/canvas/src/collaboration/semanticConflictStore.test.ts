import { describe, expect, it } from 'vitest'
import { addConflict, dismissConflict, listConflicts, resolveConflict } from './semanticConflictStore.ts'
describe('semantic conflict store', () => {
  it('adds and resolves conflicts', () => {
    addConflict({ conflictId: 'c1', issueType: 'orphaned_node', affectedNodeId: 'n1', source: 'reconnect', createdAt: '2026-01-01', availableActions: ['keepLocal'] })
    expect(listConflicts()).toHaveLength(1)
    expect(resolveConflict('c1', 'keepLocal').applied).toBe(true)
    expect(dismissConflict('missing').applied).toBe(true)
  })
})
