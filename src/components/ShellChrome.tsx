import type { ReactNode } from 'react'
import { EditorViewport } from './EditorViewport'

export type EditorHostState = 'empty' | 'ready' | 'unavailable'

export type ShellChromeProps = {
  workspaceName: string
  syncLabel: string
  editorHostState: EditorHostState
  fileCount: number
  loadError: string | null
  children?: ReactNode
}

function editorHostCopy(state: EditorHostState, loadError: string | null): string {
  if (state === 'unavailable') {
    return loadError ?? 'Workspace could not be loaded.'
  }
  if (state === 'empty') {
    return 'No files in this workspace yet. The editor host stays empty so design objects are not drawn as DOM layers.'
  }
  return 'Editor host is reserved for the Openframe runtime. Design objects are not drawn as DOM layers.'
}

export function ShellChrome({
  workspaceName,
  syncLabel,
  editorHostState,
  fileCount,
  loadError,
  children,
}: ShellChromeProps) {
  return (
    <div className="shell" data-testid="canvas-app-shell">
      <header className="top-bar" data-testid="canvas-top-bar">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <p className="product">Openframe</p>
        </div>
        <div className="file-crumb">
          <h1>{workspaceName}</h1>
          <span className="crumb-sep" aria-hidden="true">/</span>
          <span className="file-chip">Untitled</span>
        </div>
        <div className="top-actions">
          <span className="zoom-chip">100%</span>
          <p className="sync" data-testid="canvas-sync-label">
            {syncLabel}
          </p>
          <button type="button" className="share-button">Share</button>
        </div>
      </header>
      <main className="workspace">
        <section className="editor-host" data-testid="canvas-editor-host" aria-label="Editor host">
          {children}
          <footer className="bottom-bar">
            <span>Page 1</span>
            <span className="bottom-spacer" />
            <span>100%</span>
            <p className="sr-only" data-testid="canvas-editor-host-copy">{editorHostCopy(editorHostState, loadError)}</p>
            {editorHostState !== 'unavailable' ? <EditorViewport /> : null}
            {editorHostState !== 'unavailable' ? (
              <p className="sr-only file-count" data-testid="canvas-file-count">
                {fileCount === 0 ? 'Empty workspace' : `${fileCount} files`}
              </p>
            ) : null}
          </footer>
        </section>
        <aside className="status" data-testid="canvas-status-region" aria-label="Operational status">
          <h2>Status</h2>
          <p>UI chrome only. Scene rendering stays outside this shell.</p>
        </aside>
      </main>
    </div>
  )
}
