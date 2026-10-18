import { insertAuditEvent, type AuditEvent } from './repository.ts'

const secretKeys = new Set(['password', 'authorization_code', 'access_token', 'refresh_token', 'client_secret', 'provider_secret'])

export function writeAuditEvent(input: Omit<AuditEvent, 'occurred_at' | 'metadata'> & { metadata?: Record<string, string> }): AuditEvent {
  const metadata: Record<string, string> = {}
  for (const [key, value] of Object.entries(input.metadata ?? {})) {
    if (!secretKeys.has(key)) {
      metadata[key] = value
    }
  }
  const event: AuditEvent = {
    actor_user_id: input.actor_user_id,
    resource_type: input.resource_type,
    resource_id: input.resource_id,
    operation: input.operation,
    outcome: input.outcome,
    request_id: input.request_id,
    metadata,
    occurred_at: new Date().toISOString(),
  }
  insertAuditEvent(event)
  return event
}
