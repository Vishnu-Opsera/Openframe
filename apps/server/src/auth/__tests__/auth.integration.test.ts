import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handleAuthRequest } from '../index.ts'

const users = JSON.parse(readFileSync('apps/server/test/fixtures/auth_users.fixture.json', 'utf8')) as {
  users: Array<{ actor_user_id: string; email: string; password_hash: string; disabled: boolean }>
}
const oidc = JSON.parse(readFileSync('apps/server/test/fixtures/oidc_provider.fixture.json', 'utf8')) as { issuer: string }

describe('authentication routes', () => {
  it('logs in, starts OIDC, rejects a bad callback, and returns a session', () => {
    const login = handleAuthRequest({ path: '/api/v1/auth/login', users: users.users, permissions: [], body: { email: 'ada@openframe.test', password: 'fixture-password' } })
    expect(login.status).toBe(200)
    expect('actor_user_id' in login.body && login.body.actor_user_id).toBe('11111111-1111-1111-1111-111111111111')
    expect(JSON.stringify(login.body)).not.toContain('password_hash')
    const start = handleAuthRequest({ path: '/api/v1/auth/oidc/start', users: users.users, permissions: [], issuer: oidc.issuer })
    expect(start.status).toBe(302)
    expect(start.location).toContain('code_challenge=')
    expect(start.location).toContain('code_challenge_method=S256')
    const callback = handleAuthRequest({ path: '/api/v1/auth/oidc/callback', users: users.users, permissions: [], query: { state: 'nope', expectedState: 'expected' } })
    expect(callback.status).toBe(401)
    const session = handleAuthRequest({
      path: '/api/v1/auth/session',
      users: users.users,
      permissions: [],
      session: { actor_user_id: '11111111-1111-1111-1111-111111111111', session_id: 'session-1', auth_method: 'canvas_managed', request_id: 'req-1' },
    })
    expect(session.status).toBe(200)
  })
})
