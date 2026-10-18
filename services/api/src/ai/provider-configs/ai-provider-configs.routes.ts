import { createProviderConfig, listProviderConfigsByWorkspace, ProviderConfigError } from './ai-provider-configs.repository.ts'
import type { AiProviderConfig } from './ai-provider-configs.types.ts'

export interface RouteResult {
  status: number
  body: { configs?: AiProviderConfig[]; config?: AiProviderConfig; error?: { code: string; message: string } }
}

export function handleProviderConfigRoute(input: {
  method: 'GET' | 'POST'
  authenticated: boolean
  admin: boolean
  workspaceId: string
  payload?: AiProviderConfig & { secret_value?: string }
}): RouteResult {
  if (!input.authenticated) {
    return { status: 401, body: { error: { code: 'unauthenticated', message: 'Sign in is required' } } }
  }
  if (!input.admin) {
    return { status: 403, body: { error: { code: 'forbidden', message: 'Workspace admin permission is required' } } }
  }
  try {
    if (input.method === 'GET') {
      return { status: 200, body: { configs: listProviderConfigsByWorkspace(input.workspaceId) } }
    }
    if (!input.payload) {
      return { status: 400, body: { error: { code: 'bad_request', message: 'Payload is required' } } }
    }
    return { status: 201, body: { config: createProviderConfig(input.payload) } }
  } catch (error) {
    if (error instanceof ProviderConfigError) {
      return { status: error.status, body: { error: { code: error.code, message: error.message } } }
    }
    return { status: 500, body: { error: { code: 'internal_error', message: 'The request could not be completed' } } }
  }
}
