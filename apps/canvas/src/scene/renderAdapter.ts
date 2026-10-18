export function notifyRender(changedNodeIds: string[], transactionId: string): string {
  return `delta-${transactionId}-${changedNodeIds.join(',')}`
}
