import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('visual fixture manifest', () => {
  it('maps fixtures to backend snapshots', () => {
    const manifest = JSON.parse(readFileSync('fixtures/renderer/visual/visual_fixture_manifest.json', 'utf8')) as {
      maxDiffPixelRatio: number
      fixtures: Array<{ file: string; backends: string[]; snapshot: string }>
    }
    expect(manifest.maxDiffPixelRatio).toBeLessThanOrEqual(0.01)
    for (const fixture of manifest.fixtures) {
      expect(existsSync(`fixtures/renderer/visual/${fixture.file}`)).toBe(true)
      for (const backend of fixture.backends) {
        expect(existsSync(`web/tests/renderer/__snapshots__/${fixture.snapshot}-${backend}.png`)).toBe(true)
      }
    }
  })
})
