export type AiProviderKind = 'anthropic' | 'cloud' | 'local'
export type AiRetentionPolicy = 'cloud_default' | 'local_only'
export type AiProviderConfigStatus = 'active' | 'disabled' | 'invalid'

export interface AiProviderConfig {
  id: string
  workspaceId: string
  providerKey: string
  providerKind: AiProviderKind
  displayName: string
  secretRef: string | null
  endpointUrl: string | null
  model: string
  enabled: boolean
  defaultRoutePriority: number
  retentionPolicy: AiRetentionPolicy
  dataClassification: string
  status: AiProviderConfigStatus
}
