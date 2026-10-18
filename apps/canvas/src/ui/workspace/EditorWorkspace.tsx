import { useEffect, useState } from 'react'
import { currentDocument, dispatchEditorCommand, subscribeDocument } from '../../editor/commandBus.ts'
import { handleKeyboardEvent } from '../shortcuts/keyboardController.ts'
import { CommentDrawer } from './CommentDrawer.tsx'
import { PrototypePanel } from './PrototypePanel.tsx'
import { VersionHistoryPanel } from './VersionHistoryPanel.tsx'
import { LayersTree } from '../layers/LayersTree.tsx'
import { InspectorPanel } from '../inspector/InspectorPanel.tsx'
import { PenTool } from '../tools/PenTool.tsx'
import { Toolbar, type EditorTool } from '../toolbar/Toolbar.tsx'
import { CanvasSurface } from '../../../../../web/src/canvas/CanvasSurface.tsx'

const fills = ['#ffffff', '#e4572e', '#1f6f8b', '#f2c14e', '#2f6b4f']

export function EditorWorkspace() {
  const [lastAction, setLastAction] = useState('ready')
  const [caret, setCaret] = useState(0)
  const [tool, setTool] = useState<EditorTool>('frame')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revision, setRevision] = useState(0)
  useEffect(() => subscribeDocument(() => setRevision((value) => value + 1)), [])
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

  function place(kind: EditorTool, x: number, y: number) {
    if (kind === 'text') {
      const created = dispatchEditorCommand({ type: 'createTextNode', parentId: 'page', content: 'Openframe' })
      setSelectedId(created.changedNodeIds[0] ?? null)
      setLastAction('createTextNode')
      return
    }
    if (kind !== 'frame' && kind !== 'shape') {
      return
    }
    const created = dispatchEditorCommand(kind === 'frame'
      ? { type: 'createFrame', parentId: 'page', width: 240, height: 160 }
      : { type: 'createShape', parentId: 'page', width: 140, height: 88 })
    const nodeId = created.changedNodeIds[0]
    if (!nodeId) {
      return
    }
    const fill = fills[currentDocument().nodes.page?.childIds.length ?? 0] ?? '#ffffff'
    dispatchEditorCommand({ type: 'updateNodeTransform', nodeId, x, y })
    dispatchEditorCommand({ type: 'updateNodeStyle', nodeId, fill })
    setSelectedId(nodeId)
    setLastAction(kind === 'frame' ? 'createFrame' : 'createShape')
  }

  const documentState = currentDocument()
  const page = documentState.nodes.page
  const layers = [
    ...(page?.childIds ?? []).flatMap((id) => {
      const node = documentState.nodes[id]
      return node ? [{ id: node.id, kind: node.kind, label: `${node.kind} ${node.id}` }] : []
    }),
    ...Object.values(documentState.textNodes).map((text) => ({ id: text.id, kind: 'text', label: text.content })),
  ]
  const selected = selectedId ? documentState.nodes[selectedId] : undefined
  const count = Object.keys(documentState.nodes).length + Object.keys(documentState.textNodes).length

  return (
    <section className="editor-app" data-testid="editor-workspace" data-last-action={lastAction} data-revision={revision}>
      <div className="tool-rail" aria-label="Tools">
        <Toolbar tool={tool} onTool={setTool} onCreateFrame={() => place('frame', 48 + layers.length * 24, 48 + layers.length * 16)} />
        <PenTool />
      </div>
      <div className="left-pane">
        <header className="pane-header">Layers</header>
        <LayersTree items={layers} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setTool('select') }} />
        <PrototypePanel />
      </div>
      <div className="stage">
        <CanvasSurface revision={revision} tool={tool} selectedId={selectedId} onPlace={place} onSelect={setSelectedId} />
        <canvas className="gpu-canvas" data-testid="gpu-canvas" data-node-count={count} />
      </div>
      <div className="right-pane">
        <header className="pane-header">Design</header>
        <InspectorPanel node={selected ?? null} onFill={(fill) => { if (selected) dispatchEditorCommand({ type: 'updateNodeStyle', nodeId: selected.id, fill }) }} />
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
