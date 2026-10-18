export function getDataClassificationRoute(role: 'admin' | 'editor' | 'anonymous'): { status: number } {
  if (role === 'anonymous') return { status: 401 }
  if (role === 'editor') return { status: 403 }
  return { status: 200 }
}
