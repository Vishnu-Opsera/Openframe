import { describe, expect, it } from 'vitest'
import { redactSecrets } from '../../src/security/redact-secrets.ts'
describe('redact secrets', () => {
  it('replaces credential-like values', () => {
    const output = redactSecrets('Authorization: Bearer test-secret-token sk-test-secret secret://workspace/test/anthropic "api_key":"value"')
    expect(output).not.toContain('test-secret-token')
    expect(output).not.toContain('sk-test-secret')
    expect(output).not.toContain('secret://workspace/test/anthropic')
    expect(output).toContain('[REDACTED]')
  })
})
