import { requireAuth } from '../auth/index.ts'
import type { AuthContext } from '../auth/session.ts'
import { createFileMetadata, readFileMetadata } from './service.ts'
import type { DesignFileRow } from './repository.ts'
import type { MembershipRow } from '../workspaces/repository.ts'

export function handleFileRoute(input: { path: string; session?: AuthContext; body?: { name?: string; schema_version?: string }; rows: DesignFileRow[]; memberships: MembershipRow[] }) {
  const auth = requireAuth(input.session)
  if ('status' in auth) {
    return { status: auth.status, body: auth.body }
  }
  const create = /^\/api\/v1\/workspaces\/([^/]+)\/files$/.exec(input.path)
  if (create?.[1]) {
    const result = createFileMetadata(input.session, create[1], input.body ?? {}, input.rows, input.memberships)
    return { status: result.statusCode, body: result.body }
  }
  const read = /^\/api\/v1\/files\/([^/]+)\/metadata$/.exec(input.path)
  if (read?.[1]) {
    const result = readFileMetadata(input.session, read[1], input.rows)
    return { status: result.statusCode, body: result.body }
  }
  return { status: 404, body: {} }
}
