import type { EditorCommand, EditorCommandResult } from './commands.ts'
import { beginTransaction, commitTransaction, rememberTransaction, rollbackTransaction } from './transactions.ts'
import { notifyRender } from '../scene/renderAdapter.ts'
import { booleanExclude, booleanIntersect, booleanSubtract, booleanUnion } from '../scene/vectorBoolean.ts'
import { createOpenPath, type VectorPathNode } from '../scene/vectorPath.ts'
import type { SceneDocument } from '../scene/nodeTypes.ts'

const vectorTypes = new Set(['addAnchorPoint', 'moveAnchorPoint', 'updateBezierHandle', 'closeVectorPath', 'splitVectorPath', 'joinVectorPaths', 'convertSegmentType', 'booleanUnion', 'booleanSubtract', 'booleanIntersect', 'booleanExclude'])

export function isVectorCommand(command: EditorCommand): boolean {
  return vectorTypes.has(command.type)
}

function fail(commandName: string, code: string, message: string): EditorCommandResult {
  return { status: 'error', transactionId: '', changedNodeIds: [], renderDeltaId: '', errors: [{ code, message, commandName, recoverable: true }] }
}

function ensure(document: SceneDocument, pathId: string): VectorPathNode {
  const existing = document.vectorPaths[pathId]
  if (existing) {
    return existing
  }
  const created = createOpenPath(pathId)
  document.vectorPaths[pathId] = created
  return created
}

export function applyVectorCommand(document: SceneDocument, command: EditorCommand, transactionId: string): EditorCommandResult {
  const snapshot = beginTransaction(document, transactionId)
  const changed: string[] = []
  if (command.type === 'addAnchorPoint') {
    const path = ensure(document, command.pathId)
    const anchor = { id: `${command.pathId}-a${path.anchors.length + 1}`, x: command.x, y: command.y, segmentType: 'line' as const, handleIn: { x: 0, y: 0 }, handleOut: { x: 0, y: 0 } }
    path.anchors.push(anchor)
    document.selectedPointId = anchor.id
    changed.push(path.id)
  } else if (command.type === 'moveAnchorPoint') {
    const path = document.vectorPaths[command.pathId]
    const anchor = path?.anchors.find((item) => item.id === command.anchorId)
    if (!path || !anchor) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'invalid_anchor', 'Anchor was not found')
    }
    anchor.x = command.x
    anchor.y = command.y
    document.selectedPointId = anchor.id
    changed.push(path.id)
  } else if (command.type === 'updateBezierHandle') {
    const path = document.vectorPaths[command.pathId]
    const anchor = path?.anchors.find((item) => item.id === command.anchorId)
    if (!path || !anchor) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'invalid_anchor', 'Anchor was not found')
    }
    const handle = command.handle === 'in' ? anchor.handleIn : anchor.handleOut
    handle.x = command.x
    handle.y = command.y
    changed.push(path.id)
  } else if (command.type === 'closeVectorPath') {
    const path = document.vectorPaths[command.pathId]
    if (!path) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'missing_path', 'Path was not found')
    }
    path.closed = true
    changed.push(path.id)
  } else if (command.type === 'splitVectorPath') {
    const path = document.vectorPaths[command.pathId]
    const index = path?.anchors.findIndex((item) => item.id === command.anchorId) ?? -1
    if (!path || index < 0) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'invalid_anchor', 'Anchor was not found')
    }
    const next = createOpenPath(`${path.id}-split`)
    next.anchors = path.anchors.slice(index)
    next.pageId = path.pageId
    path.anchors = path.anchors.slice(0, index)
    document.vectorPaths[next.id] = next
    changed.push(path.id, next.id)
  } else if (command.type === 'joinVectorPaths') {
    const left = document.vectorPaths[command.leftId]
    const right = document.vectorPaths[command.rightId]
    if (!left || !right) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'missing_path', 'Path was not found')
    }
    if (left.fillRule !== right.fillRule) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'incompatible_fill_rule', 'Paths use different fill rules')
    }
    left.anchors = [...left.anchors, ...right.anchors]
    delete document.vectorPaths[right.id]
    changed.push(left.id)
  } else if (command.type === 'convertSegmentType') {
    const path = document.vectorPaths[command.pathId]
    const anchor = path?.anchors.find((item) => item.id === command.anchorId)
    if (!path || !anchor) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'invalid_anchor', 'Anchor was not found')
    }
    anchor.segmentType = command.segmentType
    changed.push(path.id)
  } else {
    const operand = command as { type: 'booleanUnion' | 'booleanSubtract' | 'booleanIntersect' | 'booleanExclude'; leftId: string; rightId: string }
    const left = document.vectorPaths[operand.leftId]
    const right = document.vectorPaths[operand.rightId]
    if (!left || !right || left.anchors.length === 0 || right.anchors.length === 0) {
      rollbackTransaction(document, snapshot)
      return fail(operand.type, 'empty_selection', 'Boolean operands are missing')
    }
    if (left.locked || right.locked) {
      rollbackTransaction(document, snapshot)
      return fail(operand.type, 'locked_node', 'Locked nodes cannot be combined')
    }
    if (left.pageId !== right.pageId) {
      rollbackTransaction(document, snapshot)
      return fail(operand.type, 'mixed_page', 'Operands must share a page')
    }
    const derived = operand.type === 'booleanUnion'
      ? booleanUnion(left, right)
      : operand.type === 'booleanSubtract'
        ? booleanSubtract(left, right)
        : operand.type === 'booleanIntersect'
          ? booleanIntersect(left, right)
          : booleanExclude(left, right)
    left.visible = false
    right.visible = false
    document.vectorPaths[derived.id] = derived
    document.selectedPointId = derived.anchors[0]?.id ?? null
    changed.push(derived.id)
  }
  rememberTransaction(snapshot)
  commitTransaction(snapshot)
  return { status: 'ok', transactionId: snapshot.id, changedNodeIds: changed, renderDeltaId: notifyRender(changed, snapshot.id), errors: [] }
}
