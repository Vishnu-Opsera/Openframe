import { getSyncStatusLabel, type SyncStatus } from '../syncStatus'

export function SyncStatusBadge({ status }: { status: SyncStatus }) {
  return (
    <p data-testid="sync-status" role="status">
      {getSyncStatusLabel(status)}
      {status === 'error' ? <span data-testid="sync-error-message"> Local status only. No retry was sent.</span> : null}
    </p>
  )
}
