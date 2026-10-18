import { describe, expect, it } from 'vitest'
import { dispatchEditorCommand } from '../commandBus.ts'

describe('command validation', () => {
  it('returns structured errors for invalid commands', () => {
    const missing = dispatchEditorCommand({ type: 'createFrame', parentId: 'missing', width: 10, height: 10 })
    const negative = dispatchEditorCommand({ type: 'createFrame', parentId: 'page', width: -1, height: 10 })
    const mime = dispatchEditorCommand({ type: 'placeImage', parentId: 'page', mimeType: 'image/gif', width: 1, height: 1 })
    const empty = dispatchEditorCommand({ type: 'deleteSelection', nodeIds: [] })
    const cyclic = dispatchEditorCommand({ type: 'groupSelection', parentId: 'page', childIds: [] })
    for (const result of [missing, negative, mime, empty, cyclic]) {
      expect(result.errors[0]?.recoverable).toBe(true)
      expect(typeof result.errors[0]?.commandName).toBe('string')
      expect(result.errors[0]?.code).toBeTruthy()
      expect(result.errors[0]?.message).toBeTruthy()
    }
  })
})
