import type { EditorCommand, EditorCommandResult } from './commands.ts'
import type { SceneDocument } from '../scene/nodeTypes.ts'
import { validateTokenAlias } from '../scene/tokens.ts'

const tokenTypes = new Set(['createTokenCollection', 'createToken', 'bindNodeStyleToken'])

export function isTokenCommand(command: EditorCommand): boolean {
  return tokenTypes.has(command.type)
}

export function applyTokenCommand(document: SceneDocument, command: EditorCommand, transactionId: string): EditorCommandResult {
  if (command.type === 'createToken') {
    const validation = validateTokenAlias(document.tokens, command.alias)
    if (validation.error) {
      return { status: 'error', transactionId, changedNodeIds: [], renderDeltaId: '', errors: [{ code: validation.error, message: validation.error, commandName: 'createToken', recoverable: true }] }
    }
    document.tokens.push({ id: command.tokenId, alias: command.alias, modes: [{ mode: 'light', value: '#fff' }, { mode: 'dark', value: '#111' }] })
  }
  if (command.type === 'createTokenCollection') {
    document.tokenCollections.push(command.collectionId)
  }
  return { status: 'ok', transactionId, changedNodeIds: ['page'], renderDeltaId: transactionId, errors: [] }
}
