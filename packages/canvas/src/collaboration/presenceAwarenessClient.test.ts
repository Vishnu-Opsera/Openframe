import { describe, expect, it } from 'vitest'
import { applyRemotePresence, expireParticipant, listParticipants, publishPresence } from './presenceAwarenessClient.ts'

describe('presence awareness', () => {
  it('publishes and expires participants', () => {
    const state = publishPresence({ cursor: { x: 1, y: 2 }, selection: ['a'], viewport: { x: 0, y: 0 }, activeTool: 'pen', userColor: '#fff', actorId: 'actor', clientId: 'client-a', updatedAt: 1_000 })
    applyRemotePresence({ ...state, clientId: 'client-b' })
    expect(listParticipants().length).toBeGreaterThan(0)
    expect(expireParticipant('client-a', 40_000)).toBe(true)
  })
})
