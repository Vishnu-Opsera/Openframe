import { describe, expect, it } from 'vitest'
import { handleKeyboardEvent } from '../keyboardController.ts'

describe('keyboard controller', () => {
  it('ignores shortcuts inside text fields and routes editor shortcuts to the command bus', () => {
    expect(handleKeyboardEvent({ key: 'Backspace', metaKey: true, ctrlKey: false, repeat: false, targetTag: 'input' }).status).toBe('ignored')
    const dispatched = handleKeyboardEvent({ key: 'F', metaKey: true, ctrlKey: false, repeat: false, targetTag: 'div' })
    expect(dispatched.status).toBe('dispatched')
    expect(dispatched.actionId).toBe('frame')
    expect(handleKeyboardEvent({ key: 'G', metaKey: true, ctrlKey: false, repeat: true }).status).toBe('ignored')
  })
})
