import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AIProposalReviewPanel } from './AIProposalReviewPanel.tsx'
describe('proposal review integration', () => { it('passes operation ids and does not apply a transaction', () => { const accepted: string[][] = []; render(<AIProposalReviewPanel reviewModel={{ operationIds: ['1','2','3','4','5','6'], labels: ['createNode'], before: 'a', after: 'b', severity: 'info', blocking: false, proposalId: 'card' }} onAccept={(ids) => accepted.push(ids)} onReject={() => undefined} />); fireEvent.click(screen.getByRole('button', { name: 'Accept' })); expect(accepted[0]).toEqual(['1','2','3','4','5','6']) }) })
