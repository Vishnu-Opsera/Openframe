import type { EditorCommand, EditorCommandResult } from './commands.ts'
import { beginTransaction, commitTransaction, redoTransaction, rememberTransaction, undoTransaction } from './transactions.ts'
import { notifyRender } from '../scene/renderAdapter.ts'
import { createEmptyDocument, createNode, deleteNode, groupNodes, reorderNode, ungroupNode } from '../scene/sceneGraph.ts'
import { applyTextCommand, isTextCommand } from './textCommands.ts'
import { applyVectorCommand, isVectorCommand } from './vectorCommands.ts'
import type { SceneDocument } from '../scene/nodeTypes.ts'

let documentState = createEmptyDocument()
let transactionCount = 1

function error(commandName: string, code: string, message: string): EditorCommandResult {
  return { status: 'error', transactionId: '', changedNodeIds: [], renderDeltaId: '', errors: [{ code, message, commandName, recoverable: true }] }
}

export function currentDocument(): SceneDocument {
  return documentState
}

export function isCommandAvailable(commandName: string): boolean {
  return commandName.length > 0
}

export function dispatchEditorCommand(command: EditorCommand): EditorCommandResult {
  if (command.type === 'undo') {
    documentState = undoTransaction(documentState)
    return { status: 'ok', transactionId: 'undo', changedNodeIds: [], renderDeltaId: notifyRender([], 'undo'), errors: [] }
  }
  if (command.type === 'redo') {
    documentState = redoTransaction(documentState)
    return { status: 'ok', transactionId: 'redo', changedNodeIds: [], renderDeltaId: notifyRender([], 'redo'), errors: [] }
  }
  if (isVectorCommand(command)) {
    return applyVectorCommand(documentState, command, `tx-${transactionCount++}`)
  }
  if (isTextCommand(command)) {
    return applyTextCommand(documentState, command, `tx-${transactionCount++}`)
  }
  if ('width' in command && command.width < 0) {
    return error(command.type, 'negative_dimension', 'Frame dimensions must be positive')
  }
  if ('parentId' in command && command.parentId && !documentState.nodes[command.parentId]) {
    return error(command.type, 'missing_parent', 'Parent was not found')
  }
  if (command.type === 'placeImage' && command.mimeType !== 'image/png') {
    return error(command.type, 'unsupported_mime', 'Only PNG images can be placed')
  }
  if ((command.type === 'groupSelection' || command.type === 'deleteSelection') && ('childIds' in command ? command.childIds.length === 0 : command.nodeIds.length === 0)) {
    return error(command.type, 'empty_selection', 'Selection is empty')
  }
  const transaction = beginTransaction(documentState, `tx-${transactionCount++}`)
  const changed: string[] = []
  if (command.type === 'createFrame' || command.type === 'createShape' || command.type === 'placeImage') {
    const kind = command.type === 'createFrame' ? 'frame' : command.type === 'createShape' ? 'shape' : 'image'
    changed.push(createNode(documentState, { kind, parentId: command.parentId, x: 0, y: 0, width: command.width, height: command.height }).id)
  } else if (command.type === 'createGroup' || command.type === 'groupSelection') {
    const parent = documentState.nodes[command.parentId]
    const cyclic = command.childIds.some((id) => id === command.parentId || parent?.childIds.includes(id) === false && documentState.nodes[id]?.parentId === id)
    if (command.childIds.length === 0 || cyclic) {
      return error(command.type, 'cyclic_group', 'Group selection is invalid')
    }
    changed.push(groupNodes(documentState, command.parentId, command.childIds).id)
  } else if (command.type === 'ungroupSelection') {
    ungroupNode(documentState, command.groupId)
    changed.push(command.groupId)
  } else if (command.type === 'deleteSelection') {
    for (const nodeId of command.nodeIds) {
      deleteNode(documentState, nodeId)
      changed.push(nodeId)
    }
  } else if (command.type === 'reorderNode') {
    reorderNode(documentState, command.nodeId, command.index)
    changed.push(command.nodeId)
  } else if (command.type === 'updateNodeTransform') {
    const node = documentState.nodes[command.nodeId]
    if (!node) {
      return error(command.type, 'missing_node', 'Node was not found')
    }
    node.x = command.x
    node.y = command.y
    changed.push(node.id)
  } else if (command.type === 'updateNodeStyle') {
    const node = documentState.nodes[command.nodeId]
    if (!node) {
      return error(command.type, 'missing_node', 'Node was not found')
    }
    node.fill = command.fill
    changed.push(node.id)
  }
  rememberTransaction(transaction)
  commitTransaction(transaction)
  return {
    status: 'ok',
    transactionId: transaction.id,
    changedNodeIds: changed,
    renderDeltaId: notifyRender(changed, transaction.id),
    errors: [],
  }
}
