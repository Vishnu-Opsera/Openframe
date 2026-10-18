import { describe, expect, it } from 'vitest'
import { dispatchEditorCommand } from '../commandBus.ts'

describe('token commands', () => {
  it('rejects a missing alias', () => {
    const result = dispatchEditorCommand({ type: 'createToken', tokenId: 'space.1', alias: 'missing' })
    expect(result.errors[0]?.code).toBe('missing_alias')
  })
})
