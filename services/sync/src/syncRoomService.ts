import { validateRoomToken } from './auth/roomTokenValidator.ts'
import { recordJoinDenied, recordRelayLatency, setConnectedClients, setRoomCount } from './observability/metrics.ts'

export interface SyncDecision {
  closeCode?: 4401 | 4403
  relay: boolean
}

export function authorizeRoomJoin(token: string, fileId: string): SyncDecision {
  const result = validateRoomToken(token, fileId)
  if (!result.ok) {
    recordJoinDenied()
    return { closeCode: result.closeCode, relay: false }
  }
  setRoomCount(1)
  setConnectedClients(1)
  return { relay: true }
}

export function relayDurableFrame(token: string, fileId: string, frame: Uint8Array): SyncDecision {
  const started = Date.now()
  const result = validateRoomToken(token, fileId)
  if (!result.ok) {
    recordJoinDenied()
    return { closeCode: result.closeCode, relay: false }
  }
  if (!result.claims.permissions.includes('edit')) {
    recordJoinDenied()
    return { closeCode: 4403, relay: false }
  }
  recordRelayLatency(Date.now() - started)
  return { relay: frame.byteLength > 0 }
}
