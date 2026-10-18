import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse } from '../provider-adapter.ts'
export function assertLocalEndpoint(endpoint: string): void {
  if (endpoint.includes('169.254.169.254')) throw Object.assign(new Error('blocked'), { code: 'LOCAL_MODEL_ENDPOINT_NOT_ALLOWED' })
}
export function createLocalModelAdapter(endpoint: string): AiProviderAdapter {
  assertLocalEndpoint(endpoint)
  return { provider_key: 'local', provider_kind: 'local_model', async send(request: AiProviderRequest): Promise<AiProviderResponse> {
    return { text: request.prompt, provider_key: 'local', provider_kind: 'local_model' }
  } }
}
