import { forbidden, toErrorResponse, unauthenticated } from '../gateway/errors.ts'
import type { AuthContext } from '../auth/session.ts'
import { queryMembers, queryWorkspaces, type MembershipRow, type WorkspaceRow } from './repository.ts'

const listSql = 'select id, name from "WORKSPACES" where actor_user_id = $1'
const memberSql = 'select user_id, role from "WORKSPACES" where workspace_id = $1'

export function listActorWorkspaces(session: AuthContext | undefined, rows: WorkspaceRow[], memberships: MembershipRow[]) {
  if (!session) {
    return toErrorResponse(unauthenticated('Sign in is required', 'req-workspaces'), 'req-workspaces')
  }
  const workspaces = queryWorkspaces(listSql, [session.actor_user_id], rows, memberships).map((row) => ({
    id: row.id,
    name: row.name,
    role: memberships.find((item) => item.workspaceId === row.id && item.userId === session.actor_user_id)?.role ?? 'viewer',
  }))
  return { statusCode: 200, body: { workspaces } }
}

export function listWorkspaceMembers(session: AuthContext | undefined, workspaceId: string, memberships: MembershipRow[]) {
  if (!session) {
    return toErrorResponse(unauthenticated('Sign in is required', 'req-members'), 'req-members')
  }
  const actor = memberships.find((item) => item.workspaceId === workspaceId && item.userId === session.actor_user_id && item.allowed)
  if (!actor) {
    return toErrorResponse(forbidden('Workspace membership is required', 'req-members'), 'req-members')
  }
  return { statusCode: 200, body: { members: queryMembers(memberSql, [workspaceId], memberships).map((row) => ({ user_id: row.userId, role: row.role })) } }
}
