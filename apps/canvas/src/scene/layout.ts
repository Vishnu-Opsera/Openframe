export interface LayoutChild {
  id: string
  width: number
  height: number
  sizing: 'fixed' | 'stretch'
}

export interface FlexLayoutInput {
  direction: 'row' | 'column'
  wrap: boolean
  padding: number
  gap: number
  alignment: 'start' | 'center' | 'end'
  containerWidth: number
  containerHeight: number
  children: LayoutChild[]
}

export interface PlacedChild {
  id: string
  x: number
  y: number
  width: number
  height: number
  dirty: boolean
}

export function layoutFlex(input: FlexLayoutInput): PlacedChild[] | { error: string } {
  if (input.gap < 0 || input.padding < 0) {
    return { error: 'negative_spacing' }
  }
  const width = Math.max(0, input.containerWidth)
  const height = Math.max(0, input.containerHeight)
  const placed: PlacedChild[] = []
  let cursor = input.padding
  let line = input.padding
  let lineSize = 0
  for (const child of input.children) {
    const childWidth = child.sizing === 'stretch' && input.direction === 'row' ? Math.max(child.width, width - input.padding * 2) : child.width
    const childHeight = child.sizing === 'stretch' && input.direction === 'column' ? Math.max(child.height, height - input.padding * 2) : child.height
    const main = input.direction === 'row' ? childWidth : childHeight
    if (input.wrap && input.direction === 'row' && cursor + main > width && placed.length > 0) {
      cursor = input.padding
      line += lineSize + input.gap
      lineSize = 0
    }
    const cross = input.alignment === 'center' ? input.padding + 4 : input.padding
    placed.push({
      id: child.id,
      x: input.direction === 'row' ? cursor : cross,
      y: input.direction === 'column' ? cursor : line,
      width: childWidth,
      height: childHeight,
      dirty: true,
    })
    cursor += main + input.gap
    lineSize = Math.max(lineSize, input.direction === 'row' ? childHeight : childWidth)
  }
  return placed
}

export function layoutGrid(input: { columns: number; padding: number; gap: number; containerWidth: number; children: LayoutChild[] }): PlacedChild[] | { error: string } {
  if (input.columns <= 0 || input.gap < 0) {
    return { error: 'invalid_track' }
  }
  const width = Math.max(0, input.containerWidth)
  const track = (width - input.padding * 2 - input.gap * (input.columns - 1)) / input.columns
  if (!Number.isFinite(track)) {
    return { error: 'invalid_track' }
  }
  return input.children.map((child, index) => {
    const column = index % input.columns
    const row = Math.floor(index / input.columns)
    const size = child.sizing === 'stretch' ? Math.max(0, track) : child.width
    return {
      id: child.id,
      x: input.padding + column * (Math.max(0, track) + input.gap),
      y: input.padding + row * (child.height + input.gap),
      width: size,
      height: child.height,
      dirty: true,
    }
  })
}

export function recomputeLayout(children: LayoutChild[], mode: 'flex' | 'grid'): PlacedChild[] | { error: string } {
  if (mode === 'grid') {
    return layoutGrid({ columns: 2, padding: 8, gap: 4, containerWidth: 200, children })
  }
  return layoutFlex({ direction: 'row', wrap: false, padding: 8, gap: 4, alignment: 'start', containerWidth: 200, containerHeight: 80, children })
}
