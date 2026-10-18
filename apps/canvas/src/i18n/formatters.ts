import { FormatError } from './errors'

export function formatDateTime(value: Date, locale: string, timeZone = 'UTC'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(value)
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
}

export function formatCurrency(value: number, locale: string, currency: string): string {
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new FormatError('invalid_currency', `Currency ${currency} is not a supported ISO code.`)
  }
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'currency format failed'
    throw new FormatError('invalid_currency', message)
  }
}

export function formatRelativeTime(value: number, locale: string, unit: Intl.RelativeTimeFormatUnit = 'day'): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit)
}
