import { describe, expect, it } from 'vitest'
import { routeAiRequest } from '../../src/ai/provider-router/provider-router.ts'
import { redactSecrets } from '../../src/security/redact-secrets.ts'
describe('provider router redaction', () => {
  it('logs route metadata without secrets', async () => {
    const routed = await routeAiRequest({ rows: [], workspaceId: 'workspace-1', request: { model: 'm', prompt: 'p', sceneContext: {}, max_output_tokens: 1 }, adapters: [], resolveSecret: () => 'secret://workspace/test/anthropic' })
    const log = redactSecrets(JSON.stringify({ request_id: 'r1', workspace_id: 'workspace-1', provider_key: 'anthropic', operation: 'route', result: routed.status, secret: 'sk-test-secret' }))
    expect(log).toContain('request_id')
    expect(log).not.toContain('sk-test-secret')
    expect(log).not.toContain('test-secret-token')
  })
})
