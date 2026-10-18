import { createRedisPresenceBus } from './redisPresenceBus.ts'

export interface PresencePayload {
  fileId: string
  clientId: string
  cursor: { x: number; y: number }
  updatedAt: number
}

const bus = createRedisPresenceBus()
const rooms = new Map<string, PresencePayload[]>()

export function sanitizePresencePayload(payload: PresencePayload): PresencePayload {
  return { fileId: payload.fileId, clientId: payload.clientId, cursor: payload.cursor, updatedAt: payload.updatedAt }
}

export function fanoutPresence(payload: PresencePayload): PresencePayload[] {
  const sanitized = sanitizePresencePayload(payload)
  const current = rooms.get(payload.fileId) ?? []
  rooms.set(payload.fileId, [...current.filter((item) => item.clientId !== payload.clientId), sanitized])
  bus.publish(`presence:${payload.fileId}`, JSON.stringify(sanitized))
  return rooms.get(payload.fileId) ?? []
}

export function participantsFor(fileId: string, now: number): PresencePayload[] {
  return (rooms.get(fileId) ?? []).filter((item) => now - item.updatedAt <= 30_000)
}

export const presenceTtlSeconds = 30
