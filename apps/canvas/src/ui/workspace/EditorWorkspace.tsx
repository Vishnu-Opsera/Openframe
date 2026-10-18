import { useEffect, useState } from 'react'
import { currentDocument } from '../../editor/commandBus.ts'
import { handleKeyboardEvent } from '../shortcuts/keyboardController.ts'
import { CommentDrawer } from './CommentDrawer.tsx'
import { PrototypePanel } from './PrototypePanel.tsx'
import { VersionHistoryPanel } from './VersionHistoryPanel.tsx'
import { LayersTree } from '../layers/LayersTree.tsx'
import { InspectorPanel } from '../inspector/InspectorPanel.tsx'
import { PenTool } from '../tools/PenTool.tsx'
import { Toolbar } from '../toolbar/Toolbar.tsx'
import { CanvasSurface } from '../../../../../web/src/canvas/CanvasSurface.tsx'

export function EditorWorkspace() {
  const [lastAction, setLastAction] = useState('ready')
  const [caret, setCaret] = useState(0)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.tagName.toLowerCase() : 'div'
      const result = handleKeyboardEvent({
        key: event.key.length === 1 ? event.key.toUpperCase() : event.key,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        repeat: event.repeat,
        targetTag: target,
      })
      if (result.actionId) {
        setLastAction(result.actionId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  const count = Object.keys(currentDocument().nodes).length
  return (
    <section className="editor-app" data-testid="editor-workspace" data-last-action={lastAction}>
      <div className="tool-rail" aria-label="Tools">
        <Toolbar />
        <PenTool />
      </div>
      <div className="left-pane">
        <header className="pane-header">Layers</header>
        <LayersTree />
        <PrototypePanel />
      </div>
      <div className="stage">
        <CanvasSurface />
        <canvas className="gpu-canvas" data-testid="gpu-canvas" data-node-count={count} />
      </div>
      <div className="right-pane">
        <header className="pane-header">Design</header>
        <InspectorPanel />
        <CommentDrawer />
        <VersionHistoryPanel />
        <label className="caret-field">
          Caret
          <input data-testid="text-caret" value={caret} onChange={(event) => setCaret(Number(event.target.value) || 0)} />
        </label>
      </div>
    </section>
  )
}
