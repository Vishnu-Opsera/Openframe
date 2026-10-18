import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('compose smoke fixture', () => {
  it('uses non-secret placeholders', () => {
    const env = readFileSync('tests/fixtures/self-hosted/compose.env.test', 'utf8')
    expect(env).toContain('AI_PROVIDER_DEFAULT_MODE=stub')
    expect(env).not.toContain('sk-')
  })
})
