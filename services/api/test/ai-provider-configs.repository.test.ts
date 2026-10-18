import { describe, expect, it } from 'vitest'
import { createProviderConfig, listProviderConfigsByWorkspace, updateProviderConfig } from '../src/ai/provider-configs/ai-provider-configs.repository.ts'
import { providerFixtures } from './fixtures/ai-provider-configs.fixture.ts'

describe('ai provider config repository', () => {
  it('stores secret references and rejects raw secret values', () => {
    const created = createProviderConfig(providerFixtures[0]!)
    expect(created.secretRef).toBe('secret://workspace/test/anthropic')
    expect(JSON.stringify(listProviderConfigsByWorkspace('ws-1'))).not.toMatch(/sk-|api_key|secret_value/)
    expect(() => updateProviderConfig(created.id, { secret_value: 'raw-secret' })).toThrowError(expect.objectContaining({ status: 400 }))
    expect(listProviderConfigsByWorkspace('missing')).toEqual([])
  })
})
