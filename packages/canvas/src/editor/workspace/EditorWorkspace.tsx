import type { SyncConnectionState } from '../../collaboration/webSocketSyncClient.ts'

const states: SyncConnectionState[] = ['disconnected', 'connecting', 'connected', 'reconnecting', 'unauthorized', 'offline']

export function EditorWorkspace({ connectionState = 'disconnected' }: { connectionState?: SyncConnectionState }) {
  return (
    <p data-testid="sync-connection-state">
      {states.includes(connectionState) ? connectionState : 'disconnected'}
    </p>
  )
}
