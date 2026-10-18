import { describe, expect, it } from 'vitest'
import { routeAiRequest } from '../src/ai/provider-router/provider-router.ts'
import { createAnthropicClaudeAdapter } from '../src/ai/provider-router/providers/anthropic-claude.ts'

describe('ai proposal route', () => {
  it('returns 202 for a configured route and 409 when none is enabled', async () => {
    const configured = await routeAiRequest({
      rows: [{ workspaceId: 'workspace-1', provider_key: 'anthropic', provider_kind: 'claude', enabled: true, default_route_priority: 1, secret_ref: 'secret://workspace/anthropic' }],
      workspaceId: 'workspace-1',
      request: { model: 'claude', prompt: 'edit', sceneContext: {}, max_output_tokens: 10 },
      adapters: [createAnthropicClaudeAdapter(async () => ({ text: 'ok' }))],
      resolveSecret: () => '<your-api-key>',
    })
    expect(configured.status).toBe(202)
    expect(configured.body.provider?.provider_key).toBe('anthropic')
    const missing = await routeAiRequest({ rows: [], workspaceId: 'workspace-1', request: { model: 'claude', prompt: 'edit', sceneContext: {}, max_output_tokens: 10 }, adapters: [], resolveSecret: () => '' })
    expect(missing.status).toBe(409)
    expect(missing.body.error?.code).toBe('AI_PROVIDER_CONFIGURATION_REQUIRED')
  })
})
