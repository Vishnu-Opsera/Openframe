export function pseudoLocalize(value: string): string {
  return value.split(/(\{[^}]+\})/).map((part) => (part.startsWith('{') ? part : part.split('').join('·'))).join('')
}

export function preservePlaceholder(value: string, token: string): boolean {
  return pseudoLocalize(value).includes(token)
}
