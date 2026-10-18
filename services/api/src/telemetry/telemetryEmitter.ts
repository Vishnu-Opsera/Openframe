export function emitTelemetry(eventName: string, payload: Record<string, string>): { ok: boolean } {
  if ('promptBody' in payload) return { ok: false }
  return { ok: eventName.length > 0 }
}
