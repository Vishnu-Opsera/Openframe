export interface OfflineUpdate {
  updateId: string
  fileId: string
  clientId: string
  updateBytes: number[]
  createdAt: number
  retryCount: number
  acknowledgedAt: number | null
  lastError: string
}

const queue: OfflineUpdate[] = []

export function enqueueUpdate(update: OfflineUpdate): void {
  queue.push(update)
}

export function markAcknowledged(updateId: string, acknowledgedAt: number): void {
  const update = queue.find((item) => item.updateId === updateId)
  if (update) {
    update.acknowledgedAt = acknowledgedAt
  }
}

export function loadPendingUpdates(fileId: string): OfflineUpdate[] {
  return queue.filter((item) => item.fileId === fileId && item.acknowledgedAt === null)
}

export function compactAcknowledged(fileId: string): void {
  for (let index = queue.length - 1; index >= 0; index -= 1) {
    const item = queue[index]
    if (item && item.fileId === fileId && item.acknowledgedAt !== null) {
      queue.splice(index, 1)
    }
  }
}
