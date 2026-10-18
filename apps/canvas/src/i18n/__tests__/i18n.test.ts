import { describe, expect, it } from 'vitest'
import { MissingTranslationError } from '../errors'
import { t } from '../index'

describe('i18n', () => {
  it('returns the product name for en-US', () => {
    expect(t('app.name', 'en-US')).toBe('Openframe')
  })

  it('throws when a message key is missing', () => {
    expect(() => t('missing.example', 'en-US')).toThrow(MissingTranslationError)
  })
})
