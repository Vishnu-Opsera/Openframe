export class ApiError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly requestId: string
  readonly details: Record<string, string>

  constructor(statusCode: number, code: string, message: string, requestId: string, details: Record<string, string> = {}) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.requestId = requestId
    this.details = details
  }
}

export function badRequest(message: string, requestId: string, details: Record<string, string> = {}): ApiError {
  return new ApiError(400, 'bad_request', message, requestId, details)
}

export function unauthenticated(message: string, requestId: string): ApiError {
  return new ApiError(401, 'unauthenticated', message, requestId)
}

export function forbidden(message: string, requestId: string): ApiError {
  return new ApiError(403, 'forbidden', message, requestId)
}

export function notFound(message: string, requestId: string, details: Record<string, string> = {}): ApiError {
  return new ApiError(404, 'not_found', message, requestId, details)
}

export interface ErrorResponse {
  error: { code: string; message: string; details: Record<string, string> }
  request_id: string
}

const blocked = ['stack', 'token', 'password', 'secret', 'DATABASE_URL']

export function toErrorResponse(error: unknown, requestId: string): { statusCode: number; body: ErrorResponse } {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      body: { error: { code: error.code, message: error.message, details: error.details }, request_id: error.requestId || requestId },
    }
  }
  const safe = 'The request could not be completed'
  return {
    statusCode: 500,
    body: { error: { code: 'internal_error', message: safe, details: {} }, request_id: requestId },
  }
}

export function responseContainsSecrets(serialized: string): boolean {
  return blocked.some((word) => serialized.includes(word))
}
