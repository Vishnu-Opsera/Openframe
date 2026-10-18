import { describe, expect, it } from 'vitest'
import { encodeRoomToken, validateRoomToken } from '../roomTokenValidator.ts'

const claims = {
  fileId: 'test-file',
  actorId: 'actor-1',
  permissions: ['edit'],
  exp: 4_102_444_800,
  iat: 1_700_000_000,
  roomId: 'room-1',
}

describe('room token validator', () => {
  it('accepts matching file claims and rejects expiry', () => {
    const token = encodeRoomToken(claims)
    expect(validateRoomToken(token, 'test-file', 1_800_000_000).ok).toBe(true)
    expect(validateRoomToken(token, 'test-file', 4_102_444_801).ok).toBe(false)
  })
})
