import { describe, expect, it } from 'vitest'
import { resolveShortcut, shortcutRegistry } from '../shortcutRegistry.ts'

const required = ['select', 'frame', 'shape', 'pen', 'text', 'duplicate', 'group', 'ungroup', 'delete', 'copy', 'paste', 'undo', 'redo', 'zoom', 'align', 'reorder', 'component', 'comment']

describe('shortcut registry', () => {
  it('resolves macOS and Windows bindings to command ids', () => {
    for (const actionId of required) {
      const binding = shortcutRegistry.find((item) => item.actionId === actionId)
      expect(binding?.macKeys[0]).toBe('Meta')
      expect(binding?.windowsKeys[0]).toBe('Control')
      expect(binding?.commandName).toBeTruthy()
      expect(resolveShortcut('mac', binding?.macKeys[1] ?? '')?.actionId).toBeTruthy()
      expect(resolveShortcut('windows', binding?.windowsKeys[1] ?? '')?.actionId).toBeTruthy()
    }
  })
})
