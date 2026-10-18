import { dispatchEditorCommand } from '../../editor/commandBus.ts'

export function TextInspector() {
  return (
    <label>
      Weight
      <input
        data-testid="font-axis-wght"
        defaultValue="400"
        onChange={(event) => dispatchEditorCommand({ type: 'updateVariableFontAxis', nodeId: 'text-1', tag: 'wght', value: Number(event.target.value) })}
      />
    </label>
  )
}
