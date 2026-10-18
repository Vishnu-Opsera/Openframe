import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { listActorWorkspaces, listWorkspaceMembers } from '../service.ts'
import type { MembershipRow, WorkspaceRow } from '../repository.ts'

const fixture = JSON.parse(readFileSync('apps/server/test/fixtures/workspace_metadata.fixture.json', 'utf8')) as {
  workspaces: WorkspaceRow[]
  memberships: MembershipRow[]
}

const ada = { actor_user_id: '11111111-1111-1111-1111-111111111111', session_id: 's', auth_method: 'canvas_managed' as const, request_id: 'r' }

describe('workspace service', () => {
  it('filters membership and denies outsiders', () => {
    const listed = listActorWorkspaces(ada, fixture.workspaces, fixture.memberships)
    expect(listed.statusCode).toBe(200)
    if ('workspaces' in listed.body) {
      expect(listed.body.workspaces).toHaveLength(1)
    }
    const denied = listWorkspaceMembers(ada, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', fixture.memberships)
    expect(denied.statusCode).toBe(403)
  })
})
