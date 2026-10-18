import { LayoutInspector } from './LayoutInspector.tsx'
import { TextInspector } from './TextInspector.tsx'

export function InspectorPanel() {
  return (
    <aside data-testid="inspector-panel">
      <TextInspector />
      <LayoutInspector />
    </aside>
  )
}
