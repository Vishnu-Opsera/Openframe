import { describe, expect, it } from 'vitest'
import { createOpenAiCompatibleAdapter } from '../../src/ai/provider-router/providers/openai-compatible.ts'
describe('openai compatible adapter', () => {
  it('normalizes the request without secrets', async () => {
    const response = await createOpenAiCompatibleAdapter().send({ model: 'gpt', prompt: 'hi', sceneContext: {}, max_output_tokens: 16 }, 'secret')
    expect(response.text).toBe('gpt:16')
    expect(JSON.stringify(response)).not.toContain('secret')
    expect(JSON.stringify(response)).not.toContain('Authorization')
  })
})
