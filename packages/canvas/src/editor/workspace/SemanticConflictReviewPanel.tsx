import type { SemanticConflict } from '../../collaboration/semanticConflictStore.ts'
export function SemanticConflictReviewPanel({ conflicts, onResolve }: { conflicts: SemanticConflict[]; onResolve: (id: string, action: string) => { applied: boolean } }) {
  return (
    <section role="complementary" aria-label="Semantic conflict review">
      {conflicts.map((conflict) => (
        <article key={conflict.conflictId}>
          <p>{conflict.conflictId}</p>
          <p>{conflict.issueType}</p>
          <p>{conflict.affectedNodeId}</p>
          <p>{conflict.source}</p>
          <p>{conflict.createdAt}</p>
          {conflict.availableActions.map((action) => (
            <button key={action} type="button" onClick={() => onResolve(conflict.conflictId, action)}>{action}</button>
          ))}
        </article>
      ))}
    </section>
  )
}
