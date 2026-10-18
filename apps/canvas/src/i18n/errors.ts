export class MissingTranslationError extends Error {
  readonly locale: string
  readonly messageKey: string

  constructor(locale: string, messageKey: string) {
    super(`Missing translation ${messageKey} for ${locale}`)
    this.name = 'MissingTranslationError'
    this.locale = locale
    this.messageKey = messageKey
  }
}

export class CatalogLoadError extends Error {
  readonly locale: string
  readonly messageKey: string

  constructor(locale: string, messageKey: string) {
    super(`Catalog failed for ${locale} at ${messageKey}`)
    this.name = 'CatalogLoadError'
    this.locale = locale
    this.messageKey = messageKey
  }
}

export class FormatError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'FormatError'
    this.code = code
  }
}
