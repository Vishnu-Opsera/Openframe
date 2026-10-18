const capabilities = new Set(['scene.read', 'selection.read', 'comments.read', 'comments.write', 'scene.mutate', 'host.notify'])

export interface PluginManifestValidationResult {
  ok: boolean
  errors: Array<{ path: string; code: string; message: string }>
}

export function validatePluginManifest(input: unknown): PluginManifestValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: [{ path: '', code: 'PLUGIN_MANIFEST_INVALID', message: 'Manifest must be an object' }] }
  }
  const record = input as Record<string, unknown>
  const errors: PluginManifestValidationResult['errors'] = []
  if (typeof record.entrypoint !== 'string' || record.entrypoint.length === 0) {
    errors.push({ path: 'entrypoint', code: 'PLUGIN_ENTRYPOINT_REQUIRED', message: 'Entrypoint is required' })
  }
  const declared = Array.isArray(record.capabilities) ? record.capabilities : []
  for (const capability of declared) {
    if (typeof capability !== 'string' || !capabilities.has(capability)) {
      errors.push({ path: 'capabilities', code: capability === 'filesystem.read' ? 'PLUGIN_CAPABILITY_NOT_ALLOWED' : 'PLUGIN_CAPABILITY_UNKNOWN', message: 'Capability is not allowed' })
    }
  }
  return { ok: errors.length === 0, errors }
}

export function loadPluginPackageManifest(input: unknown): PluginManifestValidationResult {
  return validatePluginManifest(input)
}
