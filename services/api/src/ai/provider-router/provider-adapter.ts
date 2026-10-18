export interface AiProviderRequest {
  model: string
  prompt: string
  sceneContext: Record<string, string>
  max_output_tokens: number
}

export interface AiProviderResponse {
  text: string
  provider_key: string
  provider_kind: string
}

export interface AiProviderError {
  code: string
  message: string
}

export interface AiProviderAdapter {
  provider_key: string
  provider_kind: string
  send(request: AiProviderRequest, credential: string): Promise<AiProviderResponse>
}
