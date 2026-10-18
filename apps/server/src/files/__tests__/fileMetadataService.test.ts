import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createFileMetadata, readFileMetadata } from '../service.ts'
import type { DesignFileRow } from '../repository.ts'
import type { MembershipRow } from '../../workspaces/repository.ts'

const fixture = JSON.parse(readFileSync('apps/server/test/fixtures/workspace_metadata.fixture.json', 'utf8')) as {
  files: DesignFileRow[]
  memberships: MembershipRow[]
}
const outsider = { actor_user_id: '22222222-2222-2222-2222-222222222222', session_id: 's', auth_method: 'canvas_managed' as const, request_id: 'r' }

describe('file metadata service', () => {
  it('rejects invalid ids and unauthorized reads', () => {
    const invalid = createFileMetadata(outsider, 'not-a-uuid', { name: 'X' }, [...fixture.files], fixture.memberships)
    expect(invalid.statusCode).toBe(400)
    const missing = readFileMetadata(outsider, '99999999-9999-9999-9999-999999999999', [...fixture.files])
    expect(missing.statusCode).toBe(404)
  })
})
