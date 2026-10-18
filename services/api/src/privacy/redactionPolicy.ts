export function redactionFor(field: string): string {
  if (field === 'prompts' || field === 'provider_secret_ref') return 'redact_in_logs'
  if (field === 'actor_id') return 'loggable'
  return 'loggable'
}
