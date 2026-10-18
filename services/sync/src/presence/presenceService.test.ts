import { describe, expect, it } from 'vitest'
import { fanoutPresence, participantsFor, presenceTtlSeconds, sanitizePresencePayload } from './presenceService.ts'

describe('presence service', () => {
  it('fans out sanitized presence inside the ttl', () => {
    const payload = sanitizePresencePayload({ fileId: 'file-1', clientId: 'a', cursor: { x: 1, y: 1 }, updatedAt: 1_000 })
    expect(fanoutPresence(payload).some((item) => item.clientId === 'a')).toBe(true)
    expect(participantsFor('file-1', 1_100)).toHaveLength(1)
    expect(presenceTtlSeconds).toBeLessThanOrEqual(30)
  })
})
