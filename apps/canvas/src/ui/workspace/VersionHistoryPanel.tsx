import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export function VersionHistoryPanel() {
  return (
    <section className="subpane" data-testid="version-history-panel">
      <span className="pane-kicker">Versions</span>
      <button type="button" className="text-button" data-testid="restore-version" onClick={() => dispatchEditorCommand({ type: 'undo' })}>
        Restore
      </button>
    </section>
  )
}
