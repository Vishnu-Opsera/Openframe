export const dataEntityTypes = ['users', 'workspaces', 'design_files', 'prompts', 'ai_provider_configs', 'plugin_packages', 'audit_events'] as const
export function getDataClassification(entity: (typeof dataEntityTypes)[number]) {
  if (entity === 'ai_provider_configs') return { classification: 'Restricted', retentionCategory: 'config', redactionPolicy: 'redact_in_logs', exportable: false, erasable: true, owner: 'security' }
  if (entity === 'audit_events') return { classification: 'Internal', retentionCategory: 'audit_1_year_minimum', redactionPolicy: 'loggable', exportable: true, erasable: false, owner: 'security' }
  return { classification: 'Internal', retentionCategory: 'standard', redactionPolicy: 'loggable', exportable: true, erasable: true, owner: 'product' }
}
