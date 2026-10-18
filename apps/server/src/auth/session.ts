export interface AuthContext {
  actor_user_id: string
  session_id: string
  auth_method: 'canvas_managed' | 'oidc'
  request_id: string
}

export function createAuthContext(actorUserId: string, requestId: string, method: AuthContext['auth_method']): AuthContext {
  return { actor_user_id: actorUserId, session_id: `session-${actorUserId}`, auth_method: method, request_id: requestId }
}
