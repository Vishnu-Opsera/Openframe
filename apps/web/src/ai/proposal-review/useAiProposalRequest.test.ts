import { describe, expect, it } from 'vitest'
import { useAiProposalRequest } from './useAiProposalRequest.ts'
describe('proposal request', () => {
  it('does not apply a configuration error', () => {
    const state = useAiProposalRequest(409, 'AI_PROVIDER_CONFIGURATION_REQUIRED')
    expect(state.providerConfigurationError).toBe(true)
    expect(state.applied).toBe(false)
  })
})
