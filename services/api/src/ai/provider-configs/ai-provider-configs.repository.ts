import type { AiProviderConfig } from './ai-provider-configs.types.ts'

export class ProviderConfigError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

const rows: AiProviderConfig[] = []

export function createProviderConfig(input: AiProviderConfig & { secret_value?: string }): AiProviderConfig {
  if ('secret_value' in input && input.secret_value) {
    throw new ProviderConfigError(400, 'RAW_PROVIDER_SECRET_NOT_ALLOWED', 'Raw provider secrets are not allowed')
  }
  const stored: AiProviderConfig = { ...input, secretRef: input.secretRef }
  rows.push(stored)
  return stored
}

export function listProviderConfigsByWorkspace(workspaceId: string): AiProviderConfig[] {
  return rows.filter((row) => row.workspaceId === workspaceId).map((row) => ({ ...row, secretRef: row.secretRef }))
}

export function updateProviderConfig(id: string, patch: Partial<AiProviderConfig> & { secret_value?: string }): AiProviderConfig {
  if (patch.secret_value) {
    throw new ProviderConfigError(400, 'RAW_PROVIDER_SECRET_NOT_ALLOWED', 'Raw provider secrets are not allowed')
  }
  const current = rows.find((row) => row.id === id)
  if (!current) {
    throw new ProviderConfigError(404, 'not_found', 'Provider config was not found')
  }
  Object.assign(current, patch)
  return current
}
