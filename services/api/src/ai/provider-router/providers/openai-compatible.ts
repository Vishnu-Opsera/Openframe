import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse } from '../provider-adapter.ts'
export function createOpenAiCompatibleAdapter(): AiProviderAdapter {
  return { provider_key: 'openai', provider_kind: 'openai_compatible', async send(request: AiProviderRequest): Promise<AiProviderResponse> {
    return { text: `${request.model}:${request.max_output_tokens}`, provider_key: 'openai', provider_kind: 'openai_compatible' }
  } }
}
