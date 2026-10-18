import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createNamedVersion, diffVersionSummary, listVersions, restoreVersionTransaction } from '../versionHistory.ts'

describe('version history', () => {
  it('creates and restores a named version', () => {
    const fixture = JSON.parse(readFileSync('fixtures/canvas/version-history-snapshots.canvas.json', 'utf8')) as { name: string }
    const versions = []
    const version = createNamedVersion(versions, fixture.name)
    expect(listVersions(versions)).toHaveLength(1)
    expect(diffVersionSummary(version)).toContain(fixture.name)
    expect(restoreVersionTransaction(version).versionId).toBe(version.id)
  })
})
