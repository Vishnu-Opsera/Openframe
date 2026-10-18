import type { SyncConnectionState } from '../../collaboration/webSocketSyncClient.ts'

const states: SyncConnectionState[] = ['disconnected', 'connecting', 'connected', 'reconnecting', 'unauthorized', 'offline']

export function EditorWorkspace({ connectionState = 'disconnected', collaborationStatus = 'synced' }: { connectionState?: SyncConnectionState; collaborationStatus?: 'offline' | 'reconnecting' | 'syncing' | 'synced' }) {
  return (
    <div>
      <p data-testid="sync-connection-state">
        {states.includes(connectionState) ? connectionState : 'disconnected'}
      </p>
      <p data-testid="collaboration-status">{collaborationStatus}</p>
    </div>
  )
}
