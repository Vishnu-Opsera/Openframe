import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SemanticConflictReviewPanel } from './SemanticConflictReviewPanel.tsx'
describe('conflict review panel', () => {
  it('renders a conflict and activates keep local from the keyboard', () => {
    const calls: string[] = []
    render(<SemanticConflictReviewPanel conflicts={[{ conflictId: 'c1', issueType: 'orphaned_node', affectedNodeId: 'n1', source: 'reconnect', createdAt: '2026-01-01', availableActions: ['keepLocal'] }]} onResolve={(id, action) => { calls.push(action); return { applied: true } }} />)
    expect(screen.getByRole('complementary', { name: 'Semantic conflict review' })).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('button', { name: 'keepLocal' }), { key: 'Enter' })
    fireEvent.click(screen.getByRole('button', { name: 'keepLocal' }))
    expect(calls).toContain('keepLocal')
  })
})
