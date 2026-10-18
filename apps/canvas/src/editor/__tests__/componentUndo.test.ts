import { describe, expect, it } from 'vitest'
import { currentDocument, dispatchEditorCommand } from '../commandBus.ts'
import { undoTransaction } from '../transactions.ts'

describe('component undo', () => {
  it('restores component definitions and instance links', () => {
    dispatchEditorCommand({ type: 'createComponent', componentId: 'card' })
    dispatchEditorCommand({ type: 'createInstance', componentId: 'card', instanceId: 'card-1' })
    const before = structuredClone(currentDocument().componentRegistry)
    dispatchEditorCommand({ type: 'detachInstance', instanceId: 'card-1' })
    const restored = undoTransaction(currentDocument())
    expect(restored.componentRegistry.components.card?.id).toBe(before.components.card?.id)
    expect(restored.componentRegistry.instances['card-1']?.detached).toBe(false)
  })
})
