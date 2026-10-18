import { LayoutInspector } from './LayoutInspector.tsx'
import { TextInspector } from './TextInspector.tsx'

export function InspectorPanel({ node, onFill }: { node?: { id: string; kind: string; x: number; y: number; width: number; height: number; fill: string } | null; onFill?: (fill: string) => void }) {
  return (
    <aside className="inspector" data-testid="inspector-panel">
      {node ? (
        <label>
          Fill
          <input data-testid="fill-input" value={node.fill} onChange={(event) => onFill?.(event.target.value)} />
          <span>{node.kind} · {Math.round(node.width)} × {Math.round(node.height)}</span>
        </label>
      ) : <p>Select a layer to edit it.</p>}
      <TextInspector />
      <LayoutInspector />
    </aside>
  )
}
