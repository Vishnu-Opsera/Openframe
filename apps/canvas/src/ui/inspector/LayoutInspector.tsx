import { useState } from 'react'
import { currentDocument, dispatchEditorCommand } from '../../editor/commandBus.ts'

export function LayoutInspector() {
  const [childX, setChildX] = useState(0)
  return (
    <div data-testid="layout-inspector">
      <button type="button" data-testid="enable-flex" onClick={() => {
        dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: 200, height: 80 })
        const frame = Object.values(currentDocument().nodes).find((node) => node.kind === 'frame')
        if (!frame) {
          return
        }
        dispatchEditorCommand({ type: 'createShape', parentId: frame.id, width: 20, height: 10 })
        dispatchEditorCommand({ type: 'enableAutoLayout', nodeId: frame.id, mode: 'flex' })
        dispatchEditorCommand({ type: 'updateFlexLayout', nodeId: frame.id, direction: 'row', wrap: false, padding: 8, gap: 4 })
        const child = currentDocument().nodes[frame.childIds[0] ?? '']
        setChildX(child?.x ?? 0)
      }}>
        Flex
      </button>
      <output data-testid="layout-child-x">{childX}</output>
    </div>
  )
}
