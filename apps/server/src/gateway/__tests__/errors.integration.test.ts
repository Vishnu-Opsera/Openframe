import { describe, expect, it } from 'vitest'
import { handleRequest } from '../http.ts'

describe('error fixtures', () => {
  it('returns the documented status codes', () => {
    const bad = handleRequest('/api/v1/error-fixtures/bad-request', 'req-400')
    const unauthenticated = handleRequest('/api/v1/error-fixtures/unauthenticated', 'req-401')
    const forbidden = handleRequest('/api/v1/error-fixtures/forbidden', 'req-403')
    const missing = handleRequest('/api/v1/error-fixtures/not-found', 'req-404')
    expect(bad.statusCode).toBe(400)
    expect(bad.body).toMatchObject({ error: { code: 'bad_request' }, request_id: 'req-400' })
    expect(unauthenticated.statusCode).toBe(401)
    expect(JSON.stringify(unauthenticated.body)).not.toMatch(/stack|token|password|secret|DATABASE_URL/)
    expect(forbidden.statusCode).toBe(403)
    expect(forbidden.body).toMatchObject({ error: { code: 'forbidden' } })
    expect(missing.statusCode).toBe(404)
    expect(missing.body).toMatchObject({ error: { details: { resource_type: 'design_file' } } })
  })
})
