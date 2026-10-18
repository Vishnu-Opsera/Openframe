import { classifyScopeImpact } from './ScopeBoundaryEnforcer.ts'
export interface DiffOperation { type: string; operationId: string }
export interface DiffSeverity { level: string }
export interface DiffEngineError { error: { code: string } }
export interface DiffReviewModel { operations: DiffOperation[]; unsupportedOperations: Array<{ operationId: string; message: string }>; canAccept: boolean; scopeImpact: { reason?: string } }
const supported = ['createNode', 'updateNode', 'deleteNode', 'moveNode', 'updateTokenRef', 'updateConstraint']
export function diffProposal(input: { proposal: { operations?: Array<{ type: string; operationId: string }>; invalid?: boolean; unrelated?: boolean }; graph: unknown }): DiffReviewModel | DiffEngineError {
  if (input.proposal.invalid) return { error: { code: 'INVALID_PROPOSAL_JSON' } }
  const operations = (input.proposal.operations ?? []).filter((operation) => supported.includes(operation.type))
  const unsupportedOperations = (input.proposal.operations ?? []).filter((operation) => !supported.includes(operation.type)).map((operation) => ({ operationId: operation.operationId, message: 'unsupported' }))
  const scope = classifyScopeImpact(input.proposal.unrelated ? 'unrelated' : 'selected')
  const canAccept = scope.impact !== 'BLOCKED'
  return { operations, unsupportedOperations, canAccept, scopeImpact: scope.reason ? { reason: scope.reason } : {} }
}
