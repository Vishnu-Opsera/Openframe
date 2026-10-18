export const syncStatuses = ['offline', 'syncing', 'synced', 'error'] as const

export type SyncStatus = (typeof syncStatuses)[number]

const labels: Record<SyncStatus, string> = {
  offline: 'Offline',
  syncing: 'Syncing',
  synced: 'Synced',
  error: 'Sync needs attention',
}

export function getSyncStatusLabel(status: string): string {
  if (status === 'offline' || status === 'syncing' || status === 'synced' || status === 'error') {
    return labels[status]
  }
  return 'Sync status unknown'
}
