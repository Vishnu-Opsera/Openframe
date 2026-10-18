import { checkFilePermission, type FilePermissionRow } from '../auth/filePermissions.ts'
import { ApiError, forbidden, notFound, toErrorResponse, type ErrorResponse } from './errors.ts'

export interface HttpResult {
  statusCode: number
  body: ErrorResponse | { ok: true }
}

const fixtures: Record<string, (requestId: string) => ApiError> = {
  '/api/v1/error-fixtures/bad-request': (requestId) => new ApiError(400, 'bad_request', 'The field is invalid', requestId, { field: 'name' }),
  '/api/v1/error-fixtures/unauthenticated': (requestId) => new ApiError(401, 'unauthenticated', 'Sign in is required', requestId),
  '/api/v1/error-fixtures/forbidden': (requestId) => new ApiError(403, 'forbidden', 'You do not have access', requestId),
  '/api/v1/error-fixtures/not-found': (requestId) => notFound('Resource was not found', requestId, { resource_type: 'design_file' }),
}

export function handleProtectedRequest(path: string, actorUserId: string, rows: FilePermissionRow[], requestId = 'generated-request'): HttpResult {
  const metadata = /^\/api\/v1\/files\/([^/]+)\/metadata$/.exec(path)
  const exported = /^\/api\/v1\/files\/([^/]+)\/export$/.exec(path)
  const fileId = metadata?.[1] ?? exported?.[1]
  if (!fileId) {
    return toErrorResponse(notFound('Resource was not found', requestId), requestId)
  }
  const action = exported ? 'export' : 'open'
  const decision = checkFilePermission({ actorUserId, designFileId: fileId, action, rows })
  if (!decision.allowed) {
    return toErrorResponse(forbidden('Permission denied', requestId), requestId)
  }
  return { statusCode: 200, body: { ok: true } }
}

export function handleRequest(path: string, requestId = 'generated-request'): HttpResult {
  const build = fixtures[path]
  if (!build) {
    const response = toErrorResponse(new Error('stack token password secret DATABASE_URL'), requestId)
    return response
  }
  return toErrorResponse(build(requestId), requestId)
}
