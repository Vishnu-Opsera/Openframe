import { describe, expect, it } from 'vitest'
import { handleProviderConfigRoute } from '../src/ai/provider-configs/ai-provider-configs.routes.ts'
import { providerFixtures } from './fixtures/ai-provider-configs.fixture.ts'

const workspaceId = 'ws-1'

describe('ai provider config routes', () => {
  it('requires authentication and admin permission before creating a config', () => {
    expect(handleProviderConfigRoute({ method: 'GET', authenticated: false, admin: false, workspaceId }).status).toBe(401)
    expect(handleProviderConfigRoute({ method: 'POST', authenticated: true, admin: false, workspaceId }).status).toBe(403)
    const created = handleProviderConfigRoute({ method: 'POST', authenticated: true, admin: true, workspaceId, payload: providerFixtures[2]! })
    expect(created.status).toBe(201)
    expect(created.body.config?.secretRef).toBeNull()
  })
})
