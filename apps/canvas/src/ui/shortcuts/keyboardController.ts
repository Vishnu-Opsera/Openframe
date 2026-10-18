import { dispatchEditorCommand, isCommandAvailable } from '../../editor/commandBus.ts'
import { resolveShortcut, type ShortcutBinding } from './shortcutRegistry.ts'

export interface ShortcutActionResult {
  status: 'dispatched' | 'ignored'
  actionId?: string
}

const seen = new Set<string>()

export function handleKeyboardEvent(event: { key: string; metaKey: boolean; ctrlKey: boolean; repeat: boolean; targetTag?: string }): ShortcutActionResult {
  const editing = event.targetTag === 'input' || event.targetTag === 'textarea'
  if (editing && event.key !== 'z') {
    return { status: 'ignored' }
  }
  const platform = event.metaKey ? 'mac' : event.ctrlKey ? 'windows' : undefined
  if (!platform) {
    return { status: 'ignored' }
  }
  const binding: ShortcutBinding | undefined = resolveShortcut(platform, event.key)
  if (!binding || !isCommandAvailable(binding.commandName)) {
    return { status: 'ignored' }
  }
  if (event.repeat && binding.commandName === 'groupSelection') {
    return { status: 'ignored' }
  }
  const signature = `${binding.actionId}:${event.repeat}`
  if (binding.commandName === 'groupSelection' && seen.has(signature)) {
    return { status: 'ignored' }
  }
  seen.add(signature)
  if (binding.commandName === 'undo') {
    dispatchEditorCommand({ type: 'undo' })
  } else if (binding.commandName === 'deleteSelection') {
    dispatchEditorCommand({ type: 'deleteSelection', nodeIds: ['page'] })
  } else if (binding.commandName === 'createFrame') {
    dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: 80, height: 40 })
  }
  return { status: 'dispatched', actionId: binding.actionId }
}
