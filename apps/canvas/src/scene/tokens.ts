export interface TokenModeValue {
  mode: 'light' | 'dark'
  value: string
}

export interface DesignToken {
  id: string
  alias: string | null
  modes: TokenModeValue[]
}

export interface TokenCollection {
  id: string
  tokens: DesignToken[]
}

export interface StyleDefinition {
  id: string
  tokenId: string
}

export interface TokenAlias {
  from: string
  to: string
}

export function resolveMode(token: DesignToken, mode: 'light' | 'dark'): string {
  return token.modes.find((item) => item.mode === mode)?.value ?? ''
}

export function validateTokenAlias(tokens: DesignToken[], alias: string): { error?: string } {
  const names = new Set(tokens.map((token) => token.id))
  if (!names.has(alias)) {
    return { error: 'missing_alias' }
  }
  if (tokens.some((token) => token.alias === token.id)) {
    return { error: 'circular_alias' }
  }
  return {}
}
