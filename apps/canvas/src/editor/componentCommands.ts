import type { EditorCommand, EditorCommandResult } from './commands.ts'
import { beginTransaction, commitTransaction, rememberTransaction } from './transactions.ts'
import { notifyRender } from '../scene/renderAdapter.ts'
import { applyInstanceOverride, createComponent, createInstance, detachInstance, resetInstanceOverride, switchVariant } from '../scene/components.ts'
import type { SceneDocument } from '../scene/nodeTypes.ts'

const componentTypes = new Set(['createComponent', 'createInstance', 'switchVariant', 'resetInstanceOverride', 'detachInstance'])

export function isComponentCommand(command: EditorCommand): boolean {
  return componentTypes.has(command.type)
}

export function applyComponentCommand(document: SceneDocument, command: EditorCommand, transactionId: string): EditorCommandResult {
  const snapshot = beginTransaction(document, transactionId)
  if (command.type === 'createComponent') {
    createComponent(document.componentRegistry, command.componentId)
  } else if (command.type === 'createInstance') {
    createInstance(document.componentRegistry, command.componentId, command.instanceId)
  } else if (command.type === 'switchVariant') {
    switchVariant(document.componentRegistry, command.instanceId, command.variant)
  } else if (command.type === 'resetInstanceOverride') {
    resetInstanceOverride(document.componentRegistry, command.instanceId)
  } else if (command.type === 'detachInstance') {
    detachInstance(document.componentRegistry, command.instanceId)
  }
  if (command.type === 'createInstance') {
    applyInstanceOverride(document.componentRegistry, command.instanceId, 'label', 'override')
  }
  rememberTransaction(snapshot)
  commitTransaction(snapshot)
  return { status: 'ok', transactionId: snapshot.id, changedNodeIds: ['page'], renderDeltaId: notifyRender(['page'], snapshot.id), errors: [] }
}
