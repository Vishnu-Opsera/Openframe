export interface AIProposalReviewPanelProps { reviewModel: { operationIds: string[]; labels: string[]; before: string; after: string; severity: string; blocking: boolean; proposalId: string }; onAccept: (ids: string[]) => void; onReject: (proposalId: string) => void }
export function AIProposalReviewPanel({ reviewModel, onAccept, onReject }: AIProposalReviewPanelProps) {
  return <section><p>{reviewModel.labels.join(',')}</p><p>{reviewModel.before}</p><p>{reviewModel.after}</p><p>{reviewModel.severity}</p><button type="button" disabled={reviewModel.blocking} onClick={() => onAccept(reviewModel.operationIds)}>Accept</button><button type="button" onClick={() => onReject(reviewModel.proposalId)}>Reject</button><button type="button">Revise</button></section>
}
