export interface CapabilityRequest { capability: string }
export function createCapabilityBroker(manifest: { capabilities: string[] }, grants: string[]) {
  const allowed = new Set(grants.filter((grant) => manifest.capabilities.includes(grant)))
  return {
    dispatchCapabilityRequest(request: CapabilityRequest): { ok: boolean; code?: string } {
      if (!allowed.has(request.capability) || ['fs.readFile', 'credential.get'].includes(request.capability)) return { ok: false, code: 'PLUGIN_CAPABILITY_DENIED' }
      return { ok: true }
    },
  }
}
