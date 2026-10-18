import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AiProposalReviewPanel } from './AiProposalReviewPanel.tsx'
describe('proposal errors', () => {
  it('hides accept for configuration errors', () => {
    render(<AiProposalReviewPanel code="AI_PROVIDER_CONFIGURATION_REQUIRED" selectionScope="frame-1" />)
    expect(screen.getByText('Configure AI provider')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Accept proposal' })).toBeNull()
    for (const code of ['AI_PROVIDER_CREDENTIAL_UNAVAILABLE', 'AI_PROVIDER_UNAVAILABLE', 'LOCAL_MODEL_ENDPOINT_NOT_ALLOWED']) {
      render(<AiProposalReviewPanel code={code} selectionScope="frame-1" />)
    }
  })
})
