export const collaborationMetricNames = [
  'websocket_connect_attempt_total',
  'websocket_reconnect_delay_ms',
  'crdt_update_bytes_sent',
  'crdt_update_bytes_received',
  'crdt_ack_latency_ms',
] as const

export interface CollaborationMetric {
  name: (typeof collaborationMetricNames)[number]
  value: number
  labels: { closeCode: string; fileId?: string }
}
