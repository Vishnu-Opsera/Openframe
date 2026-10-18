import { useI18n } from '../apps/canvas/src/i18n'
import { ShellChrome, type EditorHostState } from './components/ShellChrome'
import { WorkspaceDashboard } from './dashboard/WorkspaceDashboard'
import { CanvasSurface } from '../web/src/canvas/CanvasSurface'
import { loadDefaultWorkspace } from './workspace'

export function App() {
  const i18n = useI18n()
  const loaded = loadDefaultWorkspace()

  if (!loaded.ok) {
    return (
      <ShellChrome
        workspaceName="Openframe"
        syncLabel="Unavailable"
        editorHostState="unavailable"
        fileCount={0}
        loadError={loaded.message}
      />
    )
  }

  const editorHostState: EditorHostState = loaded.workspace.files.length === 0 ? 'empty' : 'ready'

  return (
    <div data-testid="app-locale-root" dir={i18n.dir} lang={i18n.locale}>
    <ShellChrome
      workspaceName={loaded.workspace.workspaceName}
      syncLabel={loaded.workspace.syncLabel}
      editorHostState={editorHostState}
      fileCount={loaded.workspace.files.length}
      loadError={null}
    >
      <WorkspaceDashboard />
      <CanvasSurface />
    </ShellChrome>
    </div>
  )
}
