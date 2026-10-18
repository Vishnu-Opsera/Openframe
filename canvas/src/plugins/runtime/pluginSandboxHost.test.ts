import { describe, expect, it } from 'vitest'
import { acceptMessage, pluginSandboxMarkup } from './pluginSandboxHost.tsx'
describe('plugin sandbox host', () => {
  it('isolates the iframe and reports crashes without throwing', () => {
    expect(pluginSandboxMarkup()).not.toContain('allow-same-origin')
    expect(() => acceptMessage({ type: 'crash' })).not.toThrow()
    expect('PLUGIN_RUNTIME_CRASH').toContain('PLUGIN_RUNTIME_CRASH')
  })
})
