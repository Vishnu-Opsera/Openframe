import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export function Toolbar() {
  return (
    <div>
      <button type="button" data-testid="create-frame" onClick={() => dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: 120, height: 80 })}>
        Frame
      </button>
    </div>
  )
}
