export function AiProposalReviewPanel({ code, selectionScope }: { code: string; selectionScope: string }) {
  const messages: Record<string, string> = { AI_PROVIDER_CONFIGURATION_REQUIRED: 'Configure AI provider', AI_PROVIDER_CREDENTIAL_UNAVAILABLE: 'Credential unavailable', AI_PROVIDER_UNAVAILABLE: 'Provider unavailable', LOCAL_MODEL_ENDPOINT_NOT_ALLOWED: 'Endpoint not allowed' }
  return <section><p>{messages[code]}</p><p>{selectionScope}</p>{code === 'AI_PROVIDER_CONFIGURATION_REQUIRED' ? null : <button type="button">Accept proposal</button>}</section>
}
