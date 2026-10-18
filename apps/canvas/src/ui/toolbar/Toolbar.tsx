import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export type EditorTool = 'select' | 'frame' | 'shape' | 'text'

export function Toolbar({ tool = 'frame', onTool, onCreateFrame }: { tool?: EditorTool; onTool?: (tool: EditorTool) => void; onCreateFrame?: () => void }) {
  return (
    <div className="tool-stack">
      <button type="button" data-testid="tool-select" data-active={tool === 'select'} onClick={() => onTool?.('select')}>Move</button>
      <button type="button" data-testid="create-frame" data-active={tool === 'frame'} onClick={() => { onTool?.('frame'); (onCreateFrame ?? (() => dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: 240, height: 160 })))() }}>
        Frame
      </button>
      <button type="button" data-testid="tool-rectangle" data-active={tool === 'shape'} onClick={() => onTool?.('shape')}>Rect</button>
      <button type="button" data-testid="tool-text" data-active={tool === 'text'} onClick={() => onTool?.('text')}>Type</button>
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
