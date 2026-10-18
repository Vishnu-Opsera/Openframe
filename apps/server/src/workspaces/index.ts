import { requireAuth } from '../auth/index.ts'
import type { AuthContext } from '../auth/session.ts'
import { listActorWorkspaces, listWorkspaceMembers } from './service.ts'
import type { MembershipRow, WorkspaceRow } from './repository.ts'

export function handleWorkspaceRoute(input: { path: string; session?: AuthContext; rows: WorkspaceRow[]; memberships: MembershipRow[] }) {
  const auth = requireAuth(input.session)
  if ('status' in auth) {
    return { status: auth.status, body: auth.body }
  }
  if (input.path === '/api/v1/workspaces') {
    const result = listActorWorkspaces(input.session, input.rows, input.memberships)
    return { status: result.statusCode, body: result.body }
  }
  const members = /^\/api\/v1\/workspaces\/([^/]+)\/members$/.exec(input.path)
  if (members?.[1]) {
    const result = listWorkspaceMembers(input.session, members[1], input.memberships)
    return { status: result.statusCode, body: result.body }
  }
  return { status: 404, body: {} }
}
