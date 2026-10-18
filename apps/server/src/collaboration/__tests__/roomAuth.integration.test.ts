import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { FilePermissionRow } from '../../auth/filePermissions.ts'
import { issueRoomToken } from '../roomAuth.ts'

const rows = (JSON.parse(readFileSync('apps/server/test/fixtures/file_permissions.fixture.json', 'utf8')) as { rows: FilePermissionRow[] }).rows

describe('room authorization', () => {
  it('denies a room token when open permission is absent', () => {
    const denied = issueRoomToken({ actorUserId: 'user-missing', designFileId: 'file-1', rows })
    expect(denied.status).toBe(403)
  })
})
