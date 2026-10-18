export interface AuditEvent {
  actor_user_id: string
  resource_type: string
  resource_id: string
  operation: string
  outcome: string
  request_id: string
  metadata: Record<string, string>
  occurred_at: string
}

const events: AuditEvent[] = []

export function insertAuditEvent(event: AuditEvent): void {
  events.push(event)
}

export function listAuditEvents(): AuditEvent[] {
  return [...events]
}

export function resetAuditEvents(): void {
  events.length = 0
}
