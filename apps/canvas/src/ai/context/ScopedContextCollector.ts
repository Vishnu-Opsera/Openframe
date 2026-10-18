export interface SelectionBoundarySnapshot { rootNodeId: string; selectedNodeIds: string[] }
export interface ScopedAIContext { selectedNodeIds: string[]; tokenRefs: string[]; componentRefs: string[]; constraintRefs: string[]; boundary: SelectionBoundarySnapshot }
export interface ScopedContextError { error: { code: string } }
export function collectScopedContext(input: { selectedNodeIds: string[]; rootNodeId: string; tokenRefs?: string[]; componentRefs?: string[]; constraintRefs?: string[] }): ScopedAIContext | ScopedContextError {
  if (input.selectedNodeIds.length === 0) return { error: { code: 'EMPTY_SELECTION' } }
  return { selectedNodeIds: input.selectedNodeIds, tokenRefs: input.tokenRefs ?? [], componentRefs: input.componentRefs ?? [], constraintRefs: input.constraintRefs ?? [], boundary: { rootNodeId: input.rootNodeId, selectedNodeIds: input.selectedNodeIds } }
}
