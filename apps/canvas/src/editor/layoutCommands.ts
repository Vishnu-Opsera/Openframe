import type { EditorCommand, EditorCommandResult } from './commands.ts'
import { beginTransaction, commitTransaction, rememberTransaction, rollbackTransaction } from './transactions.ts'
import { notifyRender } from '../scene/renderAdapter.ts'
import { resolveConstraint } from '../scene/constraints.ts'
import { layoutFlex, layoutGrid } from '../scene/layout.ts'
import type { SceneDocument } from '../scene/nodeTypes.ts'

const layoutTypes = new Set(['updateConstraints', 'enableAutoLayout', 'updateFlexLayout', 'updateGridLayout', 'reorderAutoLayoutChild', 'resizeAutoLayoutFrame'])

export function isLayoutCommand(command: EditorCommand): boolean {
  return layoutTypes.has(command.type)
}

function fail(commandName: string, code: string, message: string): EditorCommandResult {
  return { status: 'error', transactionId: '', changedNodeIds: [], renderDeltaId: '', errors: [{ code, message, commandName, recoverable: true }] }
}

export function applyLayoutCommand(document: SceneDocument, command: EditorCommand, transactionId: string): EditorCommandResult {
  const snapshot = beginTransaction(document, transactionId)
  const nodeId = 'nodeId' in command ? command.nodeId : ''
  const node = document.nodes[nodeId]
  if (!node) {
    rollbackTransaction(document, snapshot)
    return fail(command.type, 'missing_node', 'Layout node was not found')
  }
  const changed = [node.id]
  if (command.type === 'updateConstraints') {
    node.constraint = command.constraint
    const next = resolveConstraint(node, node, { ...node, width: node.width, height: node.height }, command.constraint)
    node.x = next.x
    node.y = next.y
    node.dirty = true
  } else if (command.type === 'enableAutoLayout') {
    node.layoutMode = command.mode
    node.dirty = true
  } else if (command.type === 'updateFlexLayout') {
    const children = node.childIds.map((id) => document.nodes[id]).filter((child) => child !== undefined)
    const placed = layoutFlex({ direction: command.direction, wrap: command.wrap, padding: command.padding, gap: command.gap, alignment: 'start', containerWidth: node.width, containerHeight: node.height, children: children.map((child) => ({ id: child.id, width: child.width, height: child.height, sizing: child.constraint === 'stretch' ? 'stretch' : 'fixed' })) })
    if ('error' in placed) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, placed.error, 'Flex layout was rejected')
    }
    for (const item of placed) {
      const child = document.nodes[item.id]
      if (child) {
        child.x = item.x
        child.y = item.y
        child.dirty = false
        changed.push(child.id)
      }
    }
  } else if (command.type === 'updateGridLayout') {
    const children = node.childIds.map((id) => document.nodes[id]).filter((child) => child !== undefined)
    const placed = layoutGrid({ columns: command.columns, padding: command.padding, gap: command.gap, containerWidth: node.width, children: children.map((child) => ({ id: child.id, width: child.width, height: child.height, sizing: 'fixed' })) })
    if ('error' in placed) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, placed.error, 'Grid layout was rejected')
    }
    for (const item of placed) {
      const child = document.nodes[item.id]
      if (child) {
        child.x = item.x
        child.y = item.y
        changed.push(child.id)
      }
    }
  } else if (command.type === 'reorderAutoLayoutChild') {
    const index = node.childIds.indexOf(command.childId)
    if (index < 0) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'missing_child', 'Child was not found')
    }
    node.childIds.splice(index, 1)
    node.childIds.splice(command.index, 0, command.childId)
  } else if (command.type === 'resizeAutoLayoutFrame') {
    if (command.width <= 0 || command.height <= 0) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'degenerate_frame', 'Frame size must stay positive')
    }
    const previous = { x: node.x, y: node.y, width: node.width, height: node.height }
    node.width = command.width
    node.height = command.height
    for (const childId of node.childIds) {
      const child = document.nodes[childId]
      if (!child) {
        continue
      }
      const next = resolveConstraint(child, previous, node, child.constraint)
      child.x = next.x
      child.y = next.y
      child.width = next.width
      child.height = next.height
      child.dirty = true
      changed.push(child.id)
    }
  }
  node.dirty = false
  rememberTransaction(snapshot)
  commitTransaction(snapshot)
  return { status: 'ok', transactionId: snapshot.id, changedNodeIds: changed, renderDeltaId: notifyRender(changed, snapshot.id), errors: [] }
}
