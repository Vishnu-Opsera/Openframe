export interface BezierHandle {
  x: number
  y: number
}

export interface AnchorPoint {
  id: string
  x: number
  y: number
  segmentType: 'line' | 'curve'
  handleIn: BezierHandle
  handleOut: BezierHandle
}

export type FillRule = 'nonzero' | 'evenodd'
export type SegmentType = 'line' | 'curve'

export interface BooleanOperationMetadata {
  operation: 'union' | 'subtract' | 'intersect' | 'exclude'
  sourceIds: string[]
}

export interface VectorPathNode {
  id: string
  pageId: string
  anchors: AnchorPoint[]
  closed: boolean
  fillRule: FillRule
  visible: boolean
  locked: boolean
  booleanMetadata: BooleanOperationMetadata | null
}

export function createOpenPath(id: string): VectorPathNode {
  return { id, pageId: 'page', anchors: [], closed: false, fillRule: 'nonzero', visible: true, locked: false, booleanMetadata: null }
}
