import { describe, expect, it } from 'vitest'
import { assertLocalEndpoint } from '../../src/ai/provider-router/providers/local-model.ts'
describe('local model adapter', () => {
  it('rejects link-local metadata endpoints', () => {
    expect(() => assertLocalEndpoint('http://169.254.169.254/latest/meta-data')).toThrowError(expect.objectContaining({ code: 'LOCAL_MODEL_ENDPOINT_NOT_ALLOWED' }))
  })
})
