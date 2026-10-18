import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse } from './provider-adapter.ts'

export interface ProviderConfigRow {
  workspaceId: string
  provider_key: string
  provider_kind: string
  enabled: boolean
  default_route_priority: number
  secret_ref: string
}

export function resolveProviderRoute(rows: ProviderConfigRow[], workspaceId: string): ProviderConfigRow | undefined {
  return rows
    .filter((row) => row.workspaceId === workspaceId && row.enabled)
    .sort((left, right) => left.default_route_priority - right.default_route_priority)[0]
}

export async function routeAiRequest(input: {
  rows: ProviderConfigRow[]
  workspaceId: string
  request: AiProviderRequest
  adapters: AiProviderAdapter[]
  resolveSecret: (secretRef: string) => string
}): Promise<{ status: number; body: { jobId?: string; provider?: { provider_key: string; provider_kind: string }; error?: { code: string } }; response?: AiProviderResponse }> {
  const route = resolveProviderRoute(input.rows, input.workspaceId)
  if (!route) {
    return { status: 409, body: { error: { code: 'AI_PROVIDER_CONFIGURATION_REQUIRED' } } }
  }
  const adapter = input.adapters.find((item) => item.provider_key === route.provider_key)
  if (!adapter) {
    return { status: 503, body: { error: { code: 'AI_PROVIDER_UNAVAILABLE' } } }
  }
  const response = await adapter.send(input.request, input.resolveSecret(route.secret_ref))
  return { status: 202, body: { jobId: `job-${route.provider_key}`, provider: { provider_key: route.provider_key, provider_kind: route.provider_kind } }, response }
}
