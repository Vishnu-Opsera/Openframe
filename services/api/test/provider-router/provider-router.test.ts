import { describe, expect, it } from 'vitest'
import { resolveProviderRoute, routeAiRequest } from '../../src/ai/provider-router/provider-router.ts'
import { createAnthropicClaudeAdapter } from '../../src/ai/provider-router/providers/anthropic-claude.ts'

const rows = [
  { workspaceId: 'workspace-1', provider_key: 'anthropic', provider_kind: 'claude', enabled: true, default_route_priority: 1, secret_ref: 'secret://workspace/anthropic' },
  { workspaceId: 'workspace-1', provider_key: 'other', provider_kind: 'other', enabled: true, default_route_priority: 5, secret_ref: 'secret://other' },
]

describe('provider router', () => {
  it('selects the lowest priority enabled route', async () => {
    expect(resolveProviderRoute(rows, 'workspace-1')?.provider_key).toBe('anthropic')
    const routed = await routeAiRequest({
      rows,
      workspaceId: 'workspace-1',
      request: { model: 'claude', prompt: 'edit', sceneContext: {}, max_output_tokens: 100 },
      adapters: [createAnthropicClaudeAdapter(async () => ({ text: 'ok' }))],
      resolveSecret: () => 'secret://workspace/anthropic',
    })
    expect(routed.status).toBe(202)
    expect(JSON.stringify(routed.body)).not.toContain('secret://')
  })
})
