import { describe, expect, it } from 'vitest'
import { canAccessFile } from '../rbac.ts'

describe('file access', () => {
  it('denies access when no allow row matches', () => {
    expect(canAccessFile([], 'user-1', 'file-1')).toBe(false)
    expect(canAccessFile([{ actorUserId: 'user-1', designFileId: 'file-1', allowOpen: false }], 'user-1', 'file-1')).toBe(false)
    expect(canAccessFile([{ actorUserId: 'user-1', designFileId: 'file-1', allowOpen: true }], 'user-1', 'file-1')).toBe(true)
  })
})
