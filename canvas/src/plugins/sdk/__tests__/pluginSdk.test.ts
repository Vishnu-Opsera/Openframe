import { describe, expect, it } from 'vitest'
import { createCanvasPluginSdk } from '../index.ts'
describe('plugin sdk', () => {
  it('maps sdk calls to runtime messages', () => {
    const sent: string[] = []
    const sdk = createCanvasPluginSdk((type) => { sent.push(type); return { ok: true } })
    sdk.scene.findNodes(); sdk.selection.getCurrent(); sdk.comments.create(); sdk.mutations.apply()
    expect(sent).toEqual(['scene.findNodes', 'selection.getCurrent', 'comments.create', 'mutations.apply'])
  })
})
