import { describe, expect, it } from 'vitest'
import { createAnthropicClaudeAdapter } from '../../src/ai/provider-router/providers/anthropic-claude.ts'

describe('anthropic claude adapter', () => {
  it('sends model fields and omits secret_ref', async () => {
    const seen: string[] = []
    const adapter = createAnthropicClaudeAdapter(async (request) => {
      seen.push(request.model, request.prompt, String(request.max_output_tokens))
      return { text: 'proposal' }
    })
    const response = await adapter.send({ model: 'claude', prompt: 'edit', sceneContext: { fileId: 'file-1' }, max_output_tokens: 32 }, 'secret://workspace/anthropic')
    expect(seen).toEqual(['claude', 'edit', '32'])
    expect(JSON.stringify(response)).not.toContain('secret_ref')
  })
})
