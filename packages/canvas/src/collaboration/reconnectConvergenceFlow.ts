import { loadPendingUpdates, markAcknowledged, type OfflineUpdate } from './offlineEditQueue.ts'

export interface ReplayOptions {
  replayBatchSize: number
  unauthorized: boolean
}

export function replayPendingUpdates(fileId: string, options: ReplayOptions): OfflineUpdate[] {
  if (options.unauthorized) {
    return []
  }
  return loadPendingUpdates(fileId).slice(0, options.replayBatchSize)
}

export function verifyConvergence(left: string, right: string): boolean {
  return left === right
}

export function acknowledgeReplay(fileId: string, acknowledgedAt: number, options: ReplayOptions): number {
  const batch = replayPendingUpdates(fileId, options)
  for (const update of batch) {
    markAcknowledged(update.updateId, acknowledgedAt)
  }
  return batch.length
}
