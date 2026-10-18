import { badRequest, forbidden, notFound, toErrorResponse, unauthenticated } from '../gateway/errors.ts'
import type { AuthContext } from '../auth/session.ts'
import { findDesignFile, insertDesignFile, type DesignFileRow } from './repository.ts'
import type { MembershipRow } from '../workspaces/repository.ts'

const insertSql = 'insert into "DESIGN_FILES" (workspace_id, name, schema_version, created_by_user_id) values ($1, $2, $3, $4)'
const selectSql = 'select id from "DESIGN_FILES" where id = $1'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function createFileMetadata(session: AuthContext | undefined, workspaceId: string, body: { name?: string; schema_version?: string }, rows: DesignFileRow[], memberships: MembershipRow[]) {
  if (!session) {
    return toErrorResponse(unauthenticated('Sign in is required', 'req-files'), 'req-files')
  }
  if (!uuid.test(workspaceId) || !body.name) {
    return toErrorResponse(badRequest('File metadata is invalid', 'req-files'), 'req-files')
  }
  const member = memberships.find((item) => item.workspaceId === workspaceId && item.userId === session.actor_user_id && item.allowed)
  if (!member || member.role === 'commenter' || member.role === 'viewer') {
    return toErrorResponse(forbidden('File creation is not allowed', 'req-files'), 'req-files')
  }
  const created = insertDesignFile(insertSql, [workspaceId, body.name, body.schema_version ?? '1', session.actor_user_id], rows)
  return { statusCode: 201, body: created }
}

export function readFileMetadata(session: AuthContext | undefined, fileId: string, rows: DesignFileRow[]) {
  if (!session) {
    return toErrorResponse(unauthenticated('Sign in is required', 'req-file'), 'req-file')
  }
  if (!uuid.test(fileId)) {
    return toErrorResponse(badRequest('File id is invalid', 'req-file'), 'req-file')
  }
  const row = findDesignFile(selectSql, [fileId], rows)
  if (!row) {
    return toErrorResponse(notFound('Design file was not found', 'req-file'), 'req-file')
  }
  return {
    statusCode: 200,
    body: {
      id: row.id,
      workspace_id: row.workspace_id,
      name: row.name,
      schema_version: row.schema_version,
      created_by_user_id: row.created_by_user_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      permission: row.permission === 'comment' ? 'comment' : row.permission,
      can_edit: row.permission === 'edit',
      can_export: row.permission === 'edit',
    },
  }
}
