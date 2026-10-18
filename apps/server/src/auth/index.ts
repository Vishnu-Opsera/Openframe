import { unauthenticated, forbidden, toErrorResponse, type ErrorResponse } from '../gateway/errors.ts'
import { generatePkceChallenge, validateOidcCallback } from './oidcPkce.ts'
import { canAccessFile, type FilePermission } from './rbac.ts'
import { createAuthContext, type AuthContext } from './session.ts'

export interface AuthUser {
  actor_user_id: string
  email: string
  password_hash: string
  disabled: boolean
}

export interface AuthResponse {
  status: number
  body: ErrorResponse | AuthContext | { actor_user_id: string; session_id: string; auth_method: string } | Record<string, never>
  location?: string
}

const challenges = new Map<string, string>()

export function handleAuthRequest(input: {
  path: string
  users: AuthUser[]
  permissions: FilePermission[]
  body?: { email?: string; password?: string }
  query?: { state?: string; expectedState?: string }
  session?: AuthContext
  issuer?: string
}): AuthResponse {
  if (input.path === '/api/v1/auth/login') {
    const user = input.users.find((item) => item.email === input.body?.email && item.password_hash === input.body?.password && !item.disabled)
    if (!user) {
      const error = toErrorResponse(unauthenticated('Sign in is required', 'req-login'), 'req-login')
      return { status: error.statusCode, body: error.body }
    }
    return { status: 200, body: { actor_user_id: user.actor_user_id, session_id: `session-${user.actor_user_id}`, auth_method: 'canvas_managed' } }
  }
  if (input.path === '/api/v1/auth/oidc/start') {
    const pkce = generatePkceChallenge()
    challenges.set(pkce.state, pkce.verifier)
    const issuer = input.issuer ?? 'https://issuer.example.test'
    return { status: 302, location: `${issuer}/authorize?code_challenge=${pkce.challenge}&code_challenge_method=S256`, body: {} }
  }
  if (input.path === '/api/v1/auth/oidc/callback') {
    const valid = validateOidcCallback(input.query?.expectedState ?? '', input.query?.state ?? '')
    if (!valid) {
      const error = toErrorResponse(unauthenticated('OIDC state is invalid', 'req-oidc'), 'req-oidc')
      return { status: error.statusCode, body: error.body }
    }
    return { status: 200, body: createAuthContext('user-1', 'req-oidc', 'oidc') }
  }
  if (input.path === '/api/v1/auth/session') {
    if (!input.session) {
      const error = toErrorResponse(unauthenticated('Sign in is required', 'req-session'), 'req-session')
      return { status: error.statusCode, body: error.body }
    }
    return { status: 200, body: input.session }
  }
  return { status: 404, body: {} }
}

export function requireAuth(session: AuthContext | undefined): AuthResponse | AuthContext {
  if (!session) {
    const error = toErrorResponse(unauthenticated('Sign in is required', 'req-auth'), 'req-auth')
    return { status: error.statusCode, body: error.body }
  }
  return session
}

export function requirePermission(session: AuthContext, permissions: FilePermission[], designFileId: string): AuthResponse | { allowed: true } {
  if (!canAccessFile(permissions, session.actor_user_id, designFileId)) {
    const error = toErrorResponse(forbidden('Access denied', 'req-permission'), 'req-permission')
    return { status: error.statusCode, body: error.body }
  }
  return { allowed: true }
}
