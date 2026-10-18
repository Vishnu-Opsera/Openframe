import type { EditorCommand, EditorCommandResult } from './commands.ts'
import { beginTransaction, commitTransaction, rememberTransaction, rollbackTransaction } from './transactions.ts'
import { notifyRender } from '../scene/renderAdapter.ts'
import { createTextNode } from '../scene/textNode.ts'
import type { SceneDocument } from '../scene/nodeTypes.ts'

const textTypes = new Set(['createTextNode', 'updateTextContent', 'updateTextRangeStyle', 'updateParagraphStyle', 'updateVariableFontAxis'])

export function isTextCommand(command: EditorCommand): boolean {
  return textTypes.has(command.type)
}

function fail(commandName: string, code: string, message: string): EditorCommandResult {
  return { status: 'error', transactionId: '', changedNodeIds: [], renderDeltaId: '', errors: [{ code, message, commandName, recoverable: true }] }
}

export function applyTextCommand(document: SceneDocument, command: EditorCommand, transactionId: string): EditorCommandResult {
  const snapshot = beginTransaction(document, transactionId)
  if (command.type === 'createTextNode') {
    const node = createTextNode(`text-${Object.keys(document.textNodes).length + 1}`, command.content)
    document.textNodes[node.id] = node
    rememberTransaction(snapshot)
    commitTransaction(snapshot)
    return { status: 'ok', transactionId: snapshot.id, changedNodeIds: [node.id], renderDeltaId: notifyRender([node.id], snapshot.id), errors: [] }
  }
  const nodeId = 'nodeId' in command ? command.nodeId : ''
  const node = document.textNodes[nodeId]
  if (!node) {
    rollbackTransaction(document, snapshot)
    return fail(command.type, 'missing_text_node', 'Text node was not found')
  }
  if (command.type === 'updateTextContent') {
    if (!command.confirmed) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'composition_cancelled', 'Unconfirmed composition was not committed')
    }
    node.content = command.content
    const run = node.runs[0]
    if (run) {
      run.end = command.content.length
    }
  } else if (command.type === 'updateTextRangeStyle') {
    if (command.start < 0 || command.end > node.content.length || command.start >= command.end) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'invalid_range', 'Text range is outside the content')
    }
    const run = node.runs[0]
    if (run) {
      run.start = command.start
      run.end = command.end
      run.fontSize = command.fontSize
    }
  } else if (command.type === 'updateParagraphStyle') {
    node.paragraph.alignment = command.alignment
  } else if (command.type === 'updateVariableFontAxis') {
    const axis = node.runs[0]?.font.variableAxes.find((item) => item.tag === command.tag)
    if (!axis) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'invalid_axis_tag', 'Font axis tag is not supported')
    }
    if (command.value < axis.min || command.value > axis.max) {
      rollbackTransaction(document, snapshot)
      return fail(command.type, 'axis_out_of_range', 'Font axis value is outside the allowed range')
    }
    axis.value = command.value
  }
  rememberTransaction(snapshot)
  commitTransaction(snapshot)
  return { status: 'ok', transactionId: snapshot.id, changedNodeIds: [node.id], renderDeltaId: notifyRender([node.id], snapshot.id), errors: [] }
}
