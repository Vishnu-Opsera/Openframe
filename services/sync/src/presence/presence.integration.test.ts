import { describe, expect, it } from 'vitest'
import { fanoutPresence, participantsFor } from './presenceService.ts'

describe('presence integration', () => {
  it('isolates rooms', () => {
    fanoutPresence({ fileId: 'file-a', clientId: 'a', cursor: { x: 1, y: 1 }, updatedAt: 5_000 })
    fanoutPresence({ fileId: 'file-b', clientId: 'c', cursor: { x: 2, y: 2 }, updatedAt: 5_000 })
    expect(participantsFor('file-a', 5_100).some((item) => item.clientId === 'c')).toBe(false)
    expect(participantsFor('file-a', 5_100).some((item) => item.clientId === 'a')).toBe(true)
  })
})
