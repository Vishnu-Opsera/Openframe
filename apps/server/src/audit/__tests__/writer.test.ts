import { describe, expect, it } from 'vitest'
import { listAuditEvents, resetAuditEvents } from '../repository.ts'
import { writeAuditEvent } from '../writer.ts'

describe('audit writer', () => {
  it('redacts secrets and stamps occurred_at', () => {
    resetAuditEvents()
    writeAuditEvent({
      actor_user_id: 'user-1',
      resource_type: 'session',
      resource_id: 'session-1',
      operation: 'auth.login',
      outcome: 'allowed',
      request_id: 'req-1',
      metadata: { password: 'secret', client_secret: 'secret', note: 'ok' },
    })
    const event = listAuditEvents()[0]
    expect(event?.metadata.password).toBeUndefined()
    expect(event?.metadata.note).toBe('ok')
    expect(event?.occurred_at).toContain('T')
  })
})
