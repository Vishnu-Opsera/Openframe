import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { loadPluginPackageManifest } from '../pluginManifest.ts'

describe('plugin manifest integration', () => {
  it('rejects filesystem capabilities', () => {
    const manifest = JSON.parse(readFileSync('canvas/tests/fixtures/plugins/invalid-filesystem-plugin/manifest.json', 'utf8')) as unknown
    expect(loadPluginPackageManifest(manifest).errors[0]?.code).toBe('PLUGIN_CAPABILITY_NOT_ALLOWED')
  })
})
