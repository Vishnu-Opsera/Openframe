export interface PresenceState {
  cursor: { x: number; y: number }
  selection: string[]
  viewport: { x: number; y: number }
  activeTool: string
  userColor: string
  actorId: string
  clientId: string
  updatedAt: number
}

const participants = new Map<string, PresenceState>()

export function publishPresence(state: PresenceState): PresenceState {
  participants.set(state.clientId, state)
  return state
}

export function applyRemotePresence(state: PresenceState): void {
  participants.set(state.clientId, state)
}

export function expireParticipant(clientId: string, now: number, ttlMs = 30_000): boolean {
  const state = participants.get(clientId)
  if (state && now - state.updatedAt > ttlMs) {
    participants.delete(clientId)
    return true
  }
  return false
}

export function listParticipants(): PresenceState[] {
  return [...participants.values()]
}
