import { ApiError, notFound, toErrorResponse, type ErrorResponse } from './errors.ts'

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

export function handleRequest(path: string, requestId = 'generated-request'): HttpResult {
  const build = fixtures[path]
  if (!build) {
    const response = toErrorResponse(new Error('stack token password secret DATABASE_URL'), requestId)
    return response
  }
  return toErrorResponse(build(requestId), requestId)
}
