export function installPlugin(input: { valid: boolean; role: 'admin' | 'member' | 'anonymous' }): { status: number; code?: string; written: boolean } {
  if (input.role === 'anonymous') return { status: 401, code: 'UNAUTHENTICATED', written: false }
  if (input.role === 'member') return { status: 403, code: 'FORBIDDEN', written: false }
  if (!input.valid) return { status: 400, written: false }
  return { status: 201, written: true }
}
