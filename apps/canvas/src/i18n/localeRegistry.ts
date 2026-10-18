export const localeRegistry = [
  { id: 'en-US', productionSelectable: true },
  { id: 'de-DE', productionSelectable: true },
  { id: 'ja-JP', productionSelectable: true },
  { id: 'pseudo-XA', productionSelectable: false },
] as const

export function productionLocales(): string[] {
  return localeRegistry.filter((locale) => locale.productionSelectable).map((locale) => locale.id)
}
