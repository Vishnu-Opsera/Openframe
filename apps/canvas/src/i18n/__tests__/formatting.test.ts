import { describe, expect, it } from 'vitest'
import cases from '../__fixtures__/formatting-cases.json'
import { FormatError } from '../errors'
import { formatCurrency, formatDateTime, formatNumber, formatRelativeTime } from '../formatters'

describe('formatting', () => {
  it('formats en-US dates, numbers, currency, and relative time from the fixture', () => {
    const instant = new Date(cases.instant)
    expect(formatDateTime(instant, cases.locale, cases.timeZone)).toContain('2026')
    expect(formatNumber(cases.number, cases.locale)).toBe('1,234.5')
    expect(formatCurrency(cases.number, cases.locale, cases.currency)).toContain('1,234.50')
    expect(formatRelativeTime(cases.relativeDays, cases.locale)).toMatch(/yesterday|1 day ago/i)
  })

  it('returns a structured error for an invalid currency code', () => {
    expect(() => formatCurrency(1, 'en-US', 'usd')).toThrow(FormatError)
  })
})
