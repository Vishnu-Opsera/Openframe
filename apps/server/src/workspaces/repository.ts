export interface WorkspaceRow {
  id: string
  name: string
}

export interface MembershipRow {
  workspaceId: string
  userId: string
  role: string
  allowed: boolean
}

export function queryWorkspaces(statement: string, params: readonly string[], rows: WorkspaceRow[], memberships: MembershipRow[]): WorkspaceRow[] {
  if (!statement.includes('$1') || statement.includes('${')) {
    throw new Error('workspace lookup must be parameterized')
  }
  const actorUserId = params[0] ?? ''
  const allowed = new Set(memberships.filter((row) => row.userId === actorUserId && row.allowed).map((row) => row.workspaceId))
  return rows.filter((row) => allowed.has(row.id))
}

export function queryMembers(statement: string, params: readonly string[], memberships: MembershipRow[]): MembershipRow[] {
  if (!statement.includes('$1')) {
    throw new Error('member lookup must be parameterized')
  }
  const workspaceId = params[0] ?? ''
  return memberships.filter((row) => row.workspaceId === workspaceId && row.allowed)
}
