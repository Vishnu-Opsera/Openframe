import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PERMISSION_ACTIONS, permissionAllowed, type FilePermissionRow } from '../schema.ts'

const deny: FilePermissionRow = {
  id: '44444444-4444-4444-4444-444444444444',
  designFileId: '33333333-3333-3333-3333-333333333333',
  actorUserId: '11111111-1111-1111-1111-111111111111',
  allowOpen: false,
  allowEdit: false,
  allowComment: false,
  allowExport: false,
  allowPlugin: false,
  allowProvider: false,
}

describe('schema permissions', () => {
  it('denies open, edit, comment, export, plugin, and provider unless an allow row exists', () => {
    for (const action of PERMISSION_ACTIONS) {
      expect(permissionAllowed(undefined, action)).toBe(false)
      expect(permissionAllowed(deny, action)).toBe(false)
    }
    const fixture = readFileSync('apps/server/test/fixtures/core_metadata.fixture.sql', 'utf8')
    expect(fixture).toContain('false, false, false, false, false, false')
    expect(fixture).toContain('true, true, true, true, true, true')
  })
})
