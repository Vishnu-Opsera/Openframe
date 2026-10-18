import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export function PenTool() {
  return (
    <button type="button" data-testid="pen-anchor" onClick={() => dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'pen-path', x: 12, y: 18 })}>
      Anchor
    </button>
  )
}
