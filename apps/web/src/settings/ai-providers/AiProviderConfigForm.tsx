export function validateProviderForm(input: { provider_kind: string; secret_ref?: string; endpoint_url?: string }): string[] {
  const errors: string[] = []
  if (input.provider_kind === 'local_model' && !input.endpoint_url) errors.push('endpoint_url')
  if (input.provider_kind === 'anthropic_claude' && !input.secret_ref) errors.push('secret_ref')
  return errors
}
export function AiProviderConfigForm() { return <form aria-label="Provider configuration" /> }
