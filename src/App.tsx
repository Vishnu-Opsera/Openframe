import { ShellChrome, type EditorHostState } from './components/ShellChrome'
import { loadDefaultWorkspace } from './workspace'

export function App() {
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
    <ShellChrome
      workspaceName={loaded.workspace.workspaceName}
      syncLabel={loaded.workspace.syncLabel}
      editorHostState={editorHostState}
      fileCount={loaded.workspace.files.length}
      loadError={null}
    />
  )
}
