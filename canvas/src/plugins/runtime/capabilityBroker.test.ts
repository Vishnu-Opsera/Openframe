import { describe, expect, it } from 'vitest'
import { createCapabilityBroker } from './capabilityBroker.ts'
describe('capability broker', () => {
  it('denies host filesystem, credentials, and ungranted mutation', () => {
    const broker = createCapabilityBroker({ capabilities: ['scene.read', 'scene.mutate'] }, ['scene.read'])
    expect(broker.dispatchCapabilityRequest({ capability: 'fs.readFile' }).code).toBe('PLUGIN_CAPABILITY_DENIED')
    expect(broker.dispatchCapabilityRequest({ capability: 'credential.get' }).code).toBe('PLUGIN_CAPABILITY_DENIED')
    expect(broker.dispatchCapabilityRequest({ capability: 'scene.mutate' }).code).toBe('PLUGIN_CAPABILITY_DENIED')
  })
})
