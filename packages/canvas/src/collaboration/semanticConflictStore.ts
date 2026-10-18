export interface SemanticConflict {
  conflictId: string
  issueType: string
  affectedNodeId: string
  source: string
  createdAt: string
  availableActions: string[]
}
const conflicts: SemanticConflict[] = []
export function addConflict(conflict: SemanticConflict): void { conflicts.push(conflict) }
export function listConflicts(): SemanticConflict[] { return [...conflicts] }
export function resolveConflict(conflictId: string, action: string): { applied: boolean; action: string } {
  const index = conflicts.findIndex((item) => item.conflictId === conflictId)
  if (index >= 0) conflicts.splice(index, 1)
  return { applied: true, action }
}
export function dismissConflict(conflictId: string): { applied: boolean } {
  return { applied: resolveConflict(conflictId, 'dismiss').applied }
}
