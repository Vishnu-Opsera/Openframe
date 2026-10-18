import { describe, expect, it } from 'vitest'
import { encodeRoomToken } from '../auth/roomTokenValidator.ts'
import { relayDurableFrame } from '../syncRoomService.ts'

describe('sync room service', () => {
  it('relays an edit frame and denies comment-only edits', () => {
    const edit = encodeRoomToken({ fileId: 'test-file', actorId: 'actor-1', permissions: ['edit'], exp: 4_102_444_800, iat: 1, roomId: 'room-1' })
    const comment = encodeRoomToken({ fileId: 'test-file', actorId: 'actor-1', permissions: ['comment'], exp: 4_102_444_800, iat: 1, roomId: 'room-1' })
    expect(relayDurableFrame(edit, 'test-file', Uint8Array.from([1, 2, 3])).relay).toBe(true)
    expect(relayDurableFrame(comment, 'test-file', Uint8Array.from([1])).closeCode).toBe(4403)
  })
})
