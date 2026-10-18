import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export function VersionHistoryPanel() {
  return (
    <section data-testid="version-history-panel">
      <button type="button" data-testid="restore-version" onClick={() => dispatchEditorCommand({ type: 'undo' })}>
        Restore
      </button>
    </section>
  )
}
