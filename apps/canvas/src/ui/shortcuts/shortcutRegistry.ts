export interface ShortcutBinding {
  actionId: string
  displayName: string
  macKeys: string[]
  windowsKeys: string[]
  commandName: string
  scope: 'editor' | 'text'
  preventDefault: boolean
}

const actions = [
  ['select', 'Select', 'V', 'select'],
  ['frame', 'Frame', 'F', 'createFrame'],
  ['shape', 'Shape', 'R', 'createShape'],
  ['pen', 'Pen', 'P', 'pen'],
  ['text', 'Text', 'T', 'text'],
  ['duplicate', 'Duplicate', 'D', 'duplicate'],
  ['group', 'Group', 'G', 'groupSelection'],
  ['ungroup', 'Ungroup', 'G', 'ungroupSelection'],
  ['delete', 'Delete', 'Backspace', 'deleteSelection'],
  ['copy', 'Copy', 'C', 'copy'],
  ['paste', 'Paste', 'V', 'paste'],
  ['undo', 'Undo', 'Z', 'undo'],
  ['redo', 'Redo', 'Z', 'redo'],
  ['zoom', 'Zoom', '0', 'zoom'],
  ['align', 'Align', 'A', 'align'],
  ['reorder', 'Reorder', ']', 'reorderNode'],
  ['component', 'Component', 'K', 'component'],
  ['comment', 'Comment', 'C', 'comment'],
] as const

export const shortcutRegistry: ShortcutBinding[] = actions.map(([actionId, displayName, key, commandName]) => ({
  actionId,
  displayName,
  macKeys: ['Meta', key],
  windowsKeys: ['Control', key],
  commandName,
  scope: 'editor',
  preventDefault: true,
}))

export function resolveShortcut(platform: 'mac' | 'windows', key: string): ShortcutBinding | undefined {
  return shortcutRegistry.find((binding) => (platform === 'mac' ? binding.macKeys : binding.windowsKeys).includes(key))
}
