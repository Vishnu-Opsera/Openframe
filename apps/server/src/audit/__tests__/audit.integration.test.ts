import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handleAuthRequest, type AuthUser } from '../../auth/index.ts'
import { handleProtectedRequest } from '../../gateway/http.ts'
import { listAuditEvents, resetAuditEvents } from '../repository.ts'
import type { FilePermissionRow } from '../../auth/filePermissions.ts'

describe('audit integration', () => {
  it('records denied metadata and login', () => {
    resetAuditEvents()
    const rows = JSON.parse(readFileSync('apps/server/test/fixtures/file_permissions.fixture.json', 'utf8')) as { rows: FilePermissionRow[] }
    const denied = handleProtectedRequest('/api/v1/files/file-1/metadata', 'user-missing', rows.rows, 'req-denied')
    expect(denied.statusCode).toBe(403)
    const users = JSON.parse(readFileSync('apps/server/test/fixtures/auth_users.fixture.json', 'utf8')) as { users: AuthUser[] }
    handleAuthRequest({ path: '/api/v1/auth/login', users: users.users, permissions: [], body: { email: 'ada@openframe.test', password: 'fixture-password' } })
    const events = listAuditEvents()
    expect(events.some((event) => event.outcome === 'denied' && event.resource_type === 'design_file' && event.request_id === 'req-denied')).toBe(true)
    expect(events.some((event) => event.operation === 'auth.login')).toBe(true)
    expect(JSON.stringify(events)).not.toContain('password_hash')
  })
})
