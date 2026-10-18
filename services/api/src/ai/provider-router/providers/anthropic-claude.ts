import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse } from '../provider-adapter.ts'

export function createAnthropicClaudeAdapter(fetchImpl: (input: AiProviderRequest) => Promise<{ text: string }>): AiProviderAdapter {
  return {
    provider_key: 'anthropic',
    provider_kind: 'claude',
    async send(request: AiProviderRequest): Promise<AiProviderResponse> {
      const result = await fetchImpl(request)
      return { text: result.text, provider_key: 'anthropic', provider_kind: 'claude' }
    },
  }
}
