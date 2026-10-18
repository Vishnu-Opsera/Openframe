import { currentDocument } from '../../editor/commandBus.ts'
import { Toolbar } from '../toolbar/Toolbar.tsx'

export function EditorWorkspace() {
  const count = Object.keys(currentDocument().nodes).length
  return (
    <section data-testid="editor-workspace">
      <Toolbar />
      <canvas data-testid="gpu-canvas" data-node-count={count} />
    </section>
  )
}
