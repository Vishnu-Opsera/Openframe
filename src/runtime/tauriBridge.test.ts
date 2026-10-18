import { beforeEach, describe, expect, it, vi } from 'vitest'
import browserRuntime from '../../tests/fixtures/tauri/runtime-info.json'
import { getRuntimeInfo } from './tauriBridge'

const invoke = vi.fn()

vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: unknown[]) => invoke(...args),
}))

describe('getRuntimeInfo', () => {
  beforeEach(() => {
    invoke.mockReset()
    delete (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__
  })

  it('returns the browser fixture when the desktop global is absent', async () => {
    await expect(getRuntimeInfo()).resolves.toEqual(browserRuntime)
    expect(invoke).not.toHaveBeenCalled()
  })

  it('calls get_runtime_info through the desktop API when internals are present', async () => {
    const desktop = {
      runtime: 'tauri',
      os: 'macos',
      arch: 'aarch64',
      app_version: '0.1.0',
      tauri_major_version: 2,
    }
    invoke.mockResolvedValue(desktop)
    ;(window as Window & { __TAURI_INTERNALS__?: { invoke: typeof invoke } }).__TAURI_INTERNALS__ = {
      invoke,
    }

    await expect(getRuntimeInfo()).resolves.toEqual(desktop)
    expect(invoke).toHaveBeenCalledWith('get_runtime_info')
  })
})
