export function redactSecrets(value: string): string {
  return value.replace(/Authorization: Bearer [^\s]+/g, 'Authorization: Bearer [REDACTED]').replace(/sk-[a-z0-9-]+/g, '[REDACTED]').replace(/secret:\/\/[^\s"]+/g, '[REDACTED]').replace(/"api_key":"[^"]+"/g, '"api_key":"[REDACTED]"')
}
