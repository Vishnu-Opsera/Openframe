import { recomputeLayout } from './layout.ts'
import type { SceneDocument, SceneNode } from './nodeTypes.ts'

export function recomputeFrameLayout(document: SceneDocument, frameId: string): string[] {
  const frame = document.nodes[frameId]
  if (!frame) {
    return []
  }
  const children = frame.childIds.flatMap((id) => {
    const child = document.nodes[id]
    return child ? [{ id: child.id, width: child.width, height: child.height, sizing: 'fixed' as const }] : []
  })
  const placed = recomputeLayout(children, frame.layoutMode === 'grid' ? 'grid' : 'flex')
  if ('error' in placed) {
    return []
  }
  frame.dirty = true
  return placed.map((item) => item.id)
}

let nextId = 1

export function createEmptyDocument(): SceneDocument {
  return {
    nodes: {
      page: { id: 'page', kind: 'page', parentId: null, childIds: [], x: 0, y: 0, width: 800, height: 600, zOrder: 0, fill: 'none', locked: false, constraint: 'fixed', layoutMode: 'none', dirty: false },
    },
    vectorPaths: {},
    textNodes: {},
    selectedPointId: null,
    componentRegistry: { components: {}, instances: {} },
    review: { links: [], threads: [], versions: [] },
    tokens: [],
    tokenCollections: [],
  }
}

export function createNode(document: SceneDocument, node: Omit<SceneNode, 'id' | 'childIds' | 'zOrder' | 'fill' | 'locked' | 'constraint' | 'layoutMode' | 'dirty'> & Partial<Pick<SceneNode, 'fill' | 'locked'>>): SceneNode {
  const parent = node.parentId ? document.nodes[node.parentId] : undefined
  const created: SceneNode = {
    id: `node-${nextId++}`,
    kind: node.kind,
    parentId: node.parentId,
    childIds: [],
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    zOrder: parent ? parent.childIds.length : 0,
    fill: node.fill ?? 'none',
    locked: node.locked ?? false,
    constraint: 'fixed',
    layoutMode: 'none',
    dirty: false,
  }
  document.nodes[created.id] = created
  if (parent) {
    parent.childIds.push(created.id)
  }
  return created
}

export function deleteNode(document: SceneDocument, nodeId: string): void {
  const node = document.nodes[nodeId]
  if (!node) {
    return
  }
  for (const childId of [...node.childIds]) {
    deleteNode(document, childId)
  }
  if (node.parentId) {
    const parent = document.nodes[node.parentId]
    if (parent) {
      parent.childIds = parent.childIds.filter((id) => id !== nodeId)
    }
  }
  delete document.nodes[nodeId]
}

export function reorderNode(document: SceneDocument, nodeId: string, index: number): void {
  const node = document.nodes[nodeId]
  const parent = node?.parentId ? document.nodes[node.parentId] : undefined
  if (!node || !parent) {
    return
  }
  parent.childIds = parent.childIds.filter((id) => id !== nodeId)
  parent.childIds.splice(index, 0, nodeId)
  parent.childIds.forEach((id, position) => {
    const child = document.nodes[id]
    if (child) {
      child.zOrder = position
    }
  })
}

export function groupNodes(document: SceneDocument, parentId: string, childIds: string[]): SceneNode {
  const group = createNode(document, { kind: 'group', parentId, x: 0, y: 0, width: 10, height: 10 })
  for (const childId of childIds) {
    const child = document.nodes[childId]
    const parent = child?.parentId ? document.nodes[child.parentId] : undefined
    if (!child || !parent) {
      continue
    }
    parent.childIds = parent.childIds.filter((id) => id !== childId)
    child.parentId = group.id
    group.childIds.push(childId)
  }
  return group
}

export function ungroupNode(document: SceneDocument, groupId: string): void {
  const group = document.nodes[groupId]
  const parent = group?.parentId ? document.nodes[group.parentId] : undefined
  if (!group || !parent) {
    return
  }
  for (const childId of group.childIds) {
    const child = document.nodes[childId]
    if (child) {
      child.parentId = parent.id
      parent.childIds.push(childId)
    }
  }
  group.childIds = []
  deleteNode(document, groupId)
}
