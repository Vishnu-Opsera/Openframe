import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { addConflict, resolveConflict } from '../../collaboration/semanticConflictStore.ts'
import { SemanticConflictReviewPanel } from './SemanticConflictReviewPanel.tsx'
describe('conflict review integration', () => {
  it('keeps local only after the resolver applies', () => {
    addConflict({ conflictId: 'reconnect-1', issueType: 'unsafe_undo_target_deleted', affectedNodeId: 'frame-1', source: 'reconnectConvergenceFlow', createdAt: '2026-01-01', availableActions: ['keepLocal'] })
    let applied = false
    render(<SemanticConflictReviewPanel conflicts={[{ conflictId: 'reconnect-1', issueType: 'unsafe_undo_target_deleted', affectedNodeId: 'frame-1', source: 'reconnectConvergenceFlow', createdAt: '2026-01-01', availableActions: ['keepLocal'] }]} onResolve={(id, action) => { const result = resolveConflict(id, action); applied = result.applied; return result }} />)
    screen.getByRole('button', { name: 'keepLocal' }).click()
    expect(applied).toBe(true)
  })
})
