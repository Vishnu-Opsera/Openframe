import { describe, expect, it } from 'vitest'
import { routeAiRequest } from '../src/ai/provider-router/provider-router.ts'
describe('proposal redaction', () => {
  it('returns configuration errors without secrets', async () => {
    const response = await routeAiRequest({ rows: [], workspaceId: 'w', request: { model: 'm', prompt: 'p', sceneContext: {}, max_output_tokens: 1 }, adapters: [], resolveSecret: () => 'sk-test-secret' })
    expect([409, 503, 500]).toContain(response.status)
    expect(JSON.stringify(response.body)).not.toContain('sk-test-secret')
    expect(JSON.stringify(response.body)).not.toContain('test-secret-token')
  })
})
