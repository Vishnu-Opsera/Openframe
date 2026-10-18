import { describe, expect, it } from 'vitest'
import { resolveMode, validateTokenAlias, type DesignToken } from '../tokens.ts'

const token: DesignToken = { id: 'color.bg', alias: null, modes: [{ mode: 'light', value: '#fff' }, { mode: 'dark', value: '#111' }] }

describe('tokens', () => {
  it('resolves light and dark values', () => {
    expect(resolveMode(token, 'dark')).toBe('#111')
    expect(validateTokenAlias([token], 'missing').error).toBe('missing_alias')
  })
})
