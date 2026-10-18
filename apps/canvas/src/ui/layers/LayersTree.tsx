export function LayersTree({ items = [], selectedId = null, onSelect }: { items?: Array<{ id: string; kind: string; label: string }>; selectedId?: string | null; onSelect?: (id: string) => void }) {
  const rows = [{ id: 'library-component', kind: 'component', label: 'Component' }, { id: 'library-instance', kind: 'instance', label: 'Instance' }, ...items]
  return (
    <ul className="layers-tree" data-testid="layers-tree">
      {rows.map((item) => (
        <li key={item.id}>
          <button type="button" data-layer-kind={item.kind} data-selected={selectedId === item.id} onClick={() => onSelect?.(item.id)}>{item.label}</button>
        </li>
      ))}
    </ul>
  )
}
