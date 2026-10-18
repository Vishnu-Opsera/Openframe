import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { checkFilePermission, type FilePermissionRow } from '../filePermissions.ts'

const rows = (JSON.parse(readFileSync('apps/server/test/fixtures/file_permissions.fixture.json', 'utf8')) as { rows: FilePermissionRow[] }).rows

describe('file permissions', () => {
  it('denies every action when no allow row exists', () => {
    for (const action of ['open', 'edit', 'comment', 'export', 'plugin', 'provider']) {
      expect(checkFilePermission({ actorUserId: 'user-missing', designFileId: 'file-1', action, rows }).status).toBe(403)
    }
    expect(checkFilePermission({ actorUserId: 'user-allow', designFileId: 'file-1', action: 'unknown', rows }).status).toBe(400)
  })
})
