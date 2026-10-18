import { describe, expect, it } from 'vitest'
import { routeAiRequest } from '../../src/ai/provider-router/provider-router.ts'
import { providerKinds } from '../../src/ai/provider-router/provider-registry.ts'
import { createAnthropicClaudeAdapter } from '../../src/ai/provider-router/providers/anthropic-claude.ts'
import { createLocalModelAdapter } from '../../src/ai/provider-router/providers/local-model.ts'
import { createOpenAiCompatibleAdapter } from '../../src/ai/provider-router/providers/openai-compatible.ts'
describe('provider registry', () => {
  it('dispatches each registered kind', async () => {
    expect(providerKinds).toEqual(['anthropic_claude', 'openai_compatible', 'local_model'])
    const adapters = [createAnthropicClaudeAdapter(async () => ({ text: 'a' })), createOpenAiCompatibleAdapter(), createLocalModelAdapter('http://127.0.0.1:11434')]
    for (const adapter of adapters) {
      const routed = await routeAiRequest({ rows: [{ workspaceId: 'w', provider_key: adapter.provider_key, provider_kind: adapter.provider_kind, enabled: true, default_route_priority: 1, secret_ref: 'secret://ref' }], workspaceId: 'w', request: { model: 'm', prompt: 'p', sceneContext: {}, max_output_tokens: 1 }, adapters, resolveSecret: () => 'secret://ref' })
      expect(routed.status).toBe(202)
    }
  })
})
