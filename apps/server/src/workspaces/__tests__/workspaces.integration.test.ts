import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handleWorkspaceRoute } from '../index.ts'
import type { MembershipRow, WorkspaceRow } from '../repository.ts'

const fixture = JSON.parse(readFileSync('apps/server/test/fixtures/workspace_metadata.fixture.json', 'utf8')) as {
  workspaces: WorkspaceRow[]
  memberships: MembershipRow[]
}
const session = { actor_user_id: '11111111-1111-1111-1111-111111111111', session_id: 's', auth_method: 'canvas_managed' as const, request_id: 'r' }

describe('workspace routes', () => {
  it('lists workspaces and forbids missing membership', () => {
    const listed = handleWorkspaceRoute({ path: '/api/v1/workspaces', session, rows: fixture.workspaces, memberships: fixture.memberships })
    expect(listed.status).toBe(200)
    expect(JSON.stringify(listed.body)).toContain('Northwind')
    const denied = handleWorkspaceRoute({ path: '/api/v1/workspaces/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb/members', session, rows: fixture.workspaces, memberships: fixture.memberships })
    expect(denied.status).toBe(403)
  })
})
