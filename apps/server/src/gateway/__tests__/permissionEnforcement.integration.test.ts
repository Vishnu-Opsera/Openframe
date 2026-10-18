import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { FilePermissionRow } from '../../auth/filePermissions.ts'
import { handleProtectedRequest } from '../http.ts'

const rows = (JSON.parse(readFileSync('apps/server/test/fixtures/file_permissions.fixture.json', 'utf8')) as { rows: FilePermissionRow[] }).rows

describe('permission enforcement', () => {
  it('returns 403 for metadata without open and export without export', () => {
    expect(handleProtectedRequest('/api/v1/files/file-1/metadata', 'user-missing', rows).statusCode).toBe(403)
    expect(handleProtectedRequest('/api/v1/files/file-1/export', 'user-allow', rows).statusCode).toBe(403)
  })
})
