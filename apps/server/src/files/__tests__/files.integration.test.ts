import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handleFileRoute } from '../index.ts'
import type { DesignFileRow } from '../repository.ts'
import type { MembershipRow } from '../../workspaces/repository.ts'

const fixture = JSON.parse(readFileSync('apps/server/test/fixtures/workspace_metadata.fixture.json', 'utf8')) as {
  files: DesignFileRow[]
  memberships: MembershipRow[]
}
const session = { actor_user_id: '11111111-1111-1111-1111-111111111111', session_id: 's', auth_method: 'canvas_managed' as const, request_id: 'r' }

describe('file metadata routes', () => {
  it('creates a design file and returns 404 for a missing id', () => {
    const created = handleFileRoute({
      path: '/api/v1/workspaces/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/files',
      session,
      body: { name: 'Poster', schema_version: '1' },
      rows: [...fixture.files],
      memberships: fixture.memberships,
    })
    expect(created.status).toBe(201)
    expect(JSON.stringify(created.body)).toContain('created_by_user_id')
    const missing = handleFileRoute({ path: '/api/v1/files/99999999-9999-9999-9999-999999999999/metadata', session, rows: [...fixture.files], memberships: fixture.memberships })
    expect(missing.status).toBe(404)
    expect(JSON.stringify(missing.body)).toContain('not_found')
  })
})
