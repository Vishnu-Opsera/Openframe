import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { FilePermissionRow } from '../../auth/filePermissions.ts'
import { handleArtifactUpload } from '../../files/storageRoutes.ts'

const storage = JSON.parse(readFileSync('apps/server/test/fixtures/object_storage.fixture.json', 'utf8')) as { config: { endpoint: string; bucket: string; region: string; credentialRef: string } }
const rows = (JSON.parse(readFileSync('apps/server/test/fixtures/file_permissions.fixture.json', 'utf8')) as { rows: FilePermissionRow[] }).rows
const bytes = new Uint8Array([9, 8, 7])
const checksum = createHash('sha256').update(bytes).digest('hex')

describe('artifact routes', () => {
  it('stores an allowed artifact and denies export without permission', () => {
    const created = handleArtifactUpload({ fileId: 'file-1', actorUserId: 'user-allow', artifactType: 'blob', bytes, checksum, rows, config: storage.config })
    expect(created.status).toBe(201)
    expect(JSON.stringify(created.body)).toContain('retention_expires_at')
    const denied = handleArtifactUpload({ fileId: 'file-1', actorUserId: 'user-allow', artifactType: 'export_artifact', bytes, checksum, rows, config: storage.config })
    expect(denied.status).toBe(403)
  })
})
