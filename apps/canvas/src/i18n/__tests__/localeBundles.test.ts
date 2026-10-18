import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function keys(locale: string): string[] {
  return Object.keys(JSON.parse(readFileSync(`apps/canvas/src/i18n/locales/${locale}.json`, 'utf8')) as Record<string, string>).sort()
}

export function compareLocaleKeys(locales: string[]): string[] {
  const baseline = keys(locales[0] ?? 'en-US')
  return locales.flatMap((locale) => baseline.filter((key) => !keys(locale).includes(key)))
}

describe('locale bundles', () => {
  it('compares locale keys', () => {
    expect(compareLocaleKeys(['en-US', 'de-DE', 'ja-JP', 'pseudo-XA'])).toEqual([])
  })
})
