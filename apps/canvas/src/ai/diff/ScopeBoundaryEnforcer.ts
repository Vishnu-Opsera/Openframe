export type ScopeImpact = 'IN_SCOPE' | 'REQUIRES_EXPANDED_SCOPE' | 'BLOCKED'
export function classifyScopeImpact(kind: 'selected' | 'shared' | 'unrelated'): { impact: ScopeImpact; reason?: string } {
  if (kind === 'selected') return { impact: 'IN_SCOPE' }
  if (kind === 'shared') return { impact: 'REQUIRES_EXPANDED_SCOPE' }
  return { impact: 'BLOCKED', reason: 'OUTSIDE_SELECTION_BOUNDARY' }
}
export function createExpandScopeApprovalToken(): string { return 'expand-ok' }
export function verifyExpandScopeApprovalToken(token?: string): boolean { return token === 'expand-ok' }
