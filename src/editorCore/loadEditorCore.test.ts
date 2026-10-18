import { describe, expect, it, vi } from 'vitest'
import failureFixture from '../../tests/fixtures/editor-core/load-failure.json'
import successFixture from '../../tests/fixtures/editor-core/editor-core-manifest.json'
import { loadEditorCore } from './loadEditorCore'

describe('loadEditorCore', () => {
  it('resolves ready with the fixture version', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    const result = await loadEditorCore(successFixture, async () => ({
      init_editor_core: () => ({ version: successFixture.version }),
    }))
    expect(result.status).toBe('ready')
    if (result.status === 'ready') {
      expect(result.version).toBe(successFixture.version)
    }
    vi.unstubAllGlobals()
  })

  it('returns the failure fixture when the binary is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await loadEditorCore(successFixture, async () => ({ init_editor_core: () => ({}) }))
    expect(result).toMatchObject({
      status: 'error',
      code: failureFixture.code,
      message: failureFixture.message,
      recoverable: false,
    })
    vi.unstubAllGlobals()
  })
})
