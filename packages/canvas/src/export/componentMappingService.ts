export function mapDesignComponentsToRepositoryComponents(): string[] { return ['Button', 'TextInput', 'Card', 'Icon'] }
export function previewMappings(configured: boolean): { status: number; body: { mappingStatus?: string; error?: { code: string } } } {
  if (!configured) return { status: 400, body: { error: { code: 'AI_PROVIDER_NOT_CONFIGURED' } } }
  return { status: 200, body: { mappingStatus: 'previewed' } }
}
