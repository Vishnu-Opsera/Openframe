export function useAiProposalRequest(status: number, code: string): { providerConfigurationError: boolean; applied: boolean } {
  if (status === 409 && code === 'AI_PROVIDER_CONFIGURATION_REQUIRED') return { providerConfigurationError: true, applied: false }
  return { providerConfigurationError: false, applied: false }
}
