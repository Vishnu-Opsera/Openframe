import { LayoutInspector } from './LayoutInspector.tsx'
import { TextInspector } from './TextInspector.tsx'

export function InspectorPanel() {
  return (
    <aside className="inspector" data-testid="inspector-panel">
      <TextInspector />
      <LayoutInspector />
    </aside>
  )
}
