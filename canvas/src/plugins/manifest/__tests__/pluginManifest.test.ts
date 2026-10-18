import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { validatePluginManifest } from '../pluginManifest.ts'

describe('plugin manifest', () => {
  it('accepts a basic plugin and rejects an unknown capability', () => {
    const valid = JSON.parse(readFileSync('canvas/tests/fixtures/plugins/valid-basic-plugin/manifest.json', 'utf8')) as unknown
    const invalid = JSON.parse(readFileSync('canvas/tests/fixtures/plugins/invalid-unknown-capability/manifest.json', 'utf8')) as unknown
    expect(validatePluginManifest(valid).ok).toBe(true)
    const rejected = validatePluginManifest(invalid)
    expect(rejected.ok).toBe(false)
    expect(rejected.errors[0]?.path).toBe('capabilities')
    expect(rejected.errors[0]?.code).toBe('PLUGIN_CAPABILITY_UNKNOWN')
  })
})
