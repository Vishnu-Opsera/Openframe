export function telemetrySettings(method: 'GET' | 'PATCH', role: 'admin' | 'editor'): { status: number } {
  if (role !== 'admin') return { status: 403 }
  return { status: 200 }
}
