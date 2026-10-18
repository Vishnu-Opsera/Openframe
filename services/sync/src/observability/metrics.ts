export interface SyncMetrics {
  sync_connected_clients: number
  sync_room_count: number
  sync_join_denied_total: number
  sync_relay_latency_ms: number
}

const metrics: SyncMetrics = {
  sync_connected_clients: 0,
  sync_room_count: 0,
  sync_join_denied_total: 0,
  sync_relay_latency_ms: 0,
}

export function recordJoinDenied(): void {
  metrics.sync_join_denied_total += 1
}

export function setConnectedClients(count: number): void {
  metrics.sync_connected_clients = count
}

export function setRoomCount(count: number): void {
  metrics.sync_room_count = count
}

export function recordRelayLatency(durationMs: number): void {
  metrics.sync_relay_latency_ms = durationMs
}

export function renderPrometheus(): string {
  return [
    `sync_connected_clients ${metrics.sync_connected_clients}`,
    `sync_room_count ${metrics.sync_room_count}`,
    `sync_join_denied_total ${metrics.sync_join_denied_total}`,
    `sync_relay_latency_ms ${metrics.sync_relay_latency_ms}`,
  ].join('\n')
}
