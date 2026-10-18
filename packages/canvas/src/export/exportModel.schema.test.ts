import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('export model schema', () => {
  it('accepts a card and rejects a missing root', () => {
    const valid = JSON.parse(readFileSync('packages/canvas/test/fixtures/export/export-model.semantic-card.json', 'utf8')) as { rootNodeId?: string }
    const invalid = JSON.parse(readFileSync('packages/canvas/test/fixtures/export/export-model.missing-node-id.json', 'utf8')) as { rootNodeId?: string }
    expect(valid.rootNodeId).toBeTruthy()
    expect(invalid.rootNodeId).toBeUndefined()
  })
})
