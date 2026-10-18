const RTL_LOCALES = new Set(['ar', 'ar-EG', 'he', 'he-IL', 'fa', 'ur'])

export function resolveLocale(locale: string | null | undefined): string {
  if (!locale || locale.trim() === '') {
    return 'en-US'
  }
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? 'en-US'
  } catch {
    if (typeof console !== 'undefined') {
      console.warn(JSON.stringify({ operation: 'locale_fallback', locale }))
    }
    return 'en-US'
  }
}

export function isRtlDisabledForV1(locale: string): boolean {
  const language = locale.split('-')[0] ?? locale
  return RTL_LOCALES.has(locale) || RTL_LOCALES.has(language)
}

export function documentDirection(locale: string): 'ltr' {
  if (isRtlDisabledForV1(locale) && typeof console !== 'undefined') {
    console.warn(JSON.stringify({ operation: 'rtl_disabled_v1', locale }))
  }
  return 'ltr'
}
