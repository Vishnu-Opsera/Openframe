import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export function Toolbar() {
  return (
    <div>
      <button type="button" data-testid="create-frame" onClick={() => dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: 120, height: 80 })}>
        Frame
      </button>
      <button type="button" data-testid="pen-tool" onClick={() => dispatchEditorCommand({ type: 'addAnchorPoint', pathId: 'pen-path', x: 10, y: 10 })}>
        Pen
      </button>
      <button type="button" data-testid="close-path" onClick={() => dispatchEditorCommand({ type: 'closeVectorPath', pathId: 'pen-path' })}>
        Close
      </button>
      <button type="button" data-testid="boolean-union" onClick={() => dispatchEditorCommand({ type: 'booleanUnion', leftId: 'left', rightId: 'right' })}>
        Union
      </button>
      <button type="button" data-testid="create-text" onClick={() => dispatchEditorCommand({ type: 'createTextNode', parentId: 'page', content: 'Openframe' })}>
        Text
      </button>
      <button type="button" data-testid="undo-edit" onClick={() => dispatchEditorCommand({ type: 'undo' })}>
        Undo
      </button>
    </div>
  )
}
