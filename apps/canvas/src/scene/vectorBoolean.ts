import type { VectorPathNode } from './vectorPath.ts'

function clone(path: VectorPathNode, id: string, operation: NonNullable<VectorPathNode['booleanMetadata']>['operation'], anchors: VectorPathNode['anchors']): VectorPathNode {
  return {
    id,
    pageId: path.pageId,
    anchors,
    closed: true,
    fillRule: path.fillRule,
    visible: true,
    locked: false,
    booleanMetadata: { operation, sourceIds: [] },
  }
}

export function booleanUnion(left: VectorPathNode, right: VectorPathNode): VectorPathNode {
  const result = clone(left, `${left.id}-union-${right.id}`, 'union', [...left.anchors, ...right.anchors])
  result.booleanMetadata = { operation: 'union', sourceIds: [left.id, right.id] }
  return result
}

export function booleanSubtract(left: VectorPathNode, right: VectorPathNode): VectorPathNode {
  const blocked = new Set(right.anchors.map((anchor) => `${anchor.x}:${anchor.y}`))
  const result = clone(left, `${left.id}-subtract-${right.id}`, 'subtract', left.anchors.filter((anchor) => !blocked.has(`${anchor.x}:${anchor.y}`)))
  result.booleanMetadata = { operation: 'subtract', sourceIds: [left.id, right.id] }
  return result
}

export function booleanIntersect(left: VectorPathNode, right: VectorPathNode): VectorPathNode {
  const allowed = new Set(right.anchors.map((anchor) => `${anchor.x}:${anchor.y}`))
  const result = clone(left, `${left.id}-intersect-${right.id}`, 'intersect', left.anchors.filter((anchor) => allowed.has(`${anchor.x}:${anchor.y}`)))
  result.booleanMetadata = { operation: 'intersect', sourceIds: [left.id, right.id] }
  return result
}

export function booleanExclude(left: VectorPathNode, right: VectorPathNode): VectorPathNode {
  const shared = new Set(right.anchors.map((anchor) => `${anchor.x}:${anchor.y}`))
  const leftOnly = left.anchors.filter((anchor) => !shared.has(`${anchor.x}:${anchor.y}`))
  const rightOnly = right.anchors.filter((anchor) => !shared.has(`${anchor.x}:${anchor.y}`))
  const result = clone(left, `${left.id}-exclude-${right.id}`, 'exclude', [...leftOnly, ...rightOnly])
  result.booleanMetadata = { operation: 'exclude', sourceIds: [left.id, right.id] }
  return result
}
