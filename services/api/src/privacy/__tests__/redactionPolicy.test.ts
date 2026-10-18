import { describe, expect, it } from 'vitest'
import { redactionFor } from '../redactionPolicy.ts'
describe('redaction policy', () => {
  it('redacts prompts and keeps actor ids loggable', () => {
    expect(redactionFor('prompts')).toBe('redact_in_logs')
    expect(redactionFor('provider_secret_ref')).toBe('redact_in_logs')
    expect(redactionFor('actor_id')).toBe('loggable')
  })
})
