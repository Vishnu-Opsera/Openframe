import { describe, expect, it } from 'vitest'
import { badRequest, forbidden, notFound, responseContainsSecrets, toErrorResponse, unauthenticated } from '../errors.ts'

describe('toErrorResponse', () => {
  it('formats 400, 401, 403, and 404 without secrets', () => {
    const cases = [
      badRequest('Invalid name', 'req-400', { field: 'name' }),
      unauthenticated('Sign in is required', 'req-401'),
      forbidden('Access denied', 'req-403'),
      notFound('Missing file', 'req-404', { resource_type: 'design_file' }),
    ]
    expect(cases.map((error) => error.statusCode)).toEqual([400, 401, 403, 404])
    for (const error of cases) {
      const response = toErrorResponse(error, 'fallback')
      expect(responseContainsSecrets(JSON.stringify(response.body))).toBe(false)
      expect(response.body.request_id).toBeTruthy()
    }
  })
})
