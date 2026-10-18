import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react'
import catalog from './locales/en-US.json'
import { CatalogLoadError, MissingTranslationError } from './errors'
import { formatCurrency, formatDateTime, formatNumber, formatRelativeTime } from './formatters'
import { documentDirection, resolveLocale } from './localePolicy'

export type MessageKey = keyof typeof catalog

export type I18nApi = {
  locale: string
  dir: 'ltr'
  t: (key: string) => string
  formatDateTime: (value: Date) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number, currency: string) => string
  formatRelativeTime: (value: number, unit?: Intl.RelativeTimeFormatUnit) => string
}

const I18nContext = createContext<I18nApi | null>(null)

export function createI18n(localeInput?: string | null): I18nApi {
  const locale = resolveLocale(localeInput)
  const messages: Record<string, string> = catalog
  if (!messages['app.name']) {
    throw new CatalogLoadError(locale, 'app.name')
  }

  return {
    locale,
    dir: documentDirection(locale),
    t(key: string) {
      const value = messages[key]
      if (!value) {
        throw new MissingTranslationError(locale, key)
      }
      return value
    },
    formatDateTime: (value) => formatDateTime(value, locale),
    formatNumber: (value) => formatNumber(value, locale),
    formatCurrency: (value, currency) => formatCurrency(value, locale, currency),
    formatRelativeTime: (value, unit) => formatRelativeTime(value, locale, unit),
  }
}

export function t(key: string, locale?: string): string {
  return createI18n(locale).t(key)
}

export { formatCurrency, formatDateTime, formatNumber, formatRelativeTime }
export { isRtlDisabledForV1 } from './localePolicy'

export function I18nProvider({ locale, children }: { locale?: string | null; children: ReactNode }) {
  const api = useMemo(() => createI18n(locale), [locale])
  return createElement(I18nContext.Provider, { value: api }, children)
}

export function useI18n(): I18nApi {
  const api = useContext(I18nContext)
  if (!api) {
    throw new CatalogLoadError('en-US', 'provider')
  }
  return api
}
