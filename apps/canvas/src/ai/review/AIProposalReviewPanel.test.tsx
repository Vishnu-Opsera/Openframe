import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AIProposalReviewPanel } from './AIProposalReviewPanel.tsx'
describe('proposal review', () => { it('disables accept for blocking errors', () => { render(<AIProposalReviewPanel reviewModel={{ operationIds: ['1'], labels: ['createNode'], before: 'a', after: 'b', severity: 'error', blocking: true, proposalId: 'p1' }} onAccept={() => undefined} onReject={() => undefined} />); expect(screen.getByRole('button', { name: 'Accept' })).toBeDisabled() }) })
