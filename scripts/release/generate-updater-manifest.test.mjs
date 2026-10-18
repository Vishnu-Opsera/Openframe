import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildManifest } from './generate-updater-manifest.mjs'

const artifacts = JSON.parse(readFileSync('tests/fixtures/updater/artifacts.json', 'utf8'))
const checksums = JSON.parse(readFileSync('tests/fixtures/updater/checksums.json', 'utf8'))

describe('generate updater manifest', () => {
  it('maps fixture artifacts and checksums for both desktop platforms', () => {
    const manifest = buildManifest({
      channel: 'beta',
      version: '0.1.0',
      artifacts,
      checksums,
      endpoint: '${TAURI_UPDATER_ENDPOINT}',
    })
    expect(manifest.platforms['darwin-universal'].checksum).toBe(checksums['Openframe.app.tar.gz'])
    expect(manifest.platforms['windows-x86_64'].url).toContain('Openframe-setup.exe')
    expect(manifest.platforms['darwin-universal'].signature).toBe('${TAURI_UPDATER_PUBLIC_KEY}')
  })

  it('rejects an unknown channel before writing', () => {
    expect(() =>
      buildManifest({
        channel: 'canary',
        version: '0.1.0',
        artifacts,
        checksums,
        endpoint: '${TAURI_UPDATER_ENDPOINT}',
      }),
    ).toThrow()
  })
})
