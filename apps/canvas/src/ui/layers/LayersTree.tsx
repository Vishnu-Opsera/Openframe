export function LayersTree({ items = ['component', 'instance'] }: { items?: string[] }) {
  return (
    <ul data-testid="layers-tree">
      {items.map((item) => (
        <li key={item} data-layer-kind={item}>{item}</li>
      ))}
    </ul>
  )
}
