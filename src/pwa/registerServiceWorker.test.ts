import { describe, expect, it, vi } from 'vitest'
import cacheManifest from '../../tests/fixtures/pwa/cache-manifest.json'
import { canRegisterServiceWorker, registerServiceWorker } from './registerServiceWorker'

describe('registerServiceWorker', () => {
  it('registers /sw.js for localhost and secure origins', async () => {
    const register = vi.fn().mockResolvedValue({ scope: '/' })
    const registration = await registerServiceWorker(
      { protocol: 'http:', hostname: 'localhost' },
      { serviceWorker: { register } as unknown as ServiceWorkerContainer },
    )
    expect(registration?.scope).toBe('/')
    expect(register).toHaveBeenCalledWith('/sw.js')
    expect(cacheManifest.assets).toContain('/sw.js')
  })

  it('does nothing when the service worker API is missing', async () => {
    const registration = await registerServiceWorker(
      { protocol: 'https:', hostname: 'openframe.app' },
      {} as Pick<Navigator, 'serviceWorker'>,
    )
    expect(registration).toBeNull()
    expect(canRegisterServiceWorker({ protocol: 'file:', hostname: 'local' }, undefined)).toBe(false)
  })
})
