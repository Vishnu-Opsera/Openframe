import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildExportModelFromSelection } from './exportModel.ts'
describe('export model', () => {
  it('builds a semantic card model', () => {
    const fixture = JSON.parse(readFileSync('packages/canvas/test/fixtures/export/semantic-card.canvas.json', 'utf8')) as { rootNodeId: string }
    const model = buildExportModelFromSelection(fixture)
    expect(model.exportModelVersion).toBe('1')
    expect(model.tokens.colors.length).toBeGreaterThan(0)
    expect(model.layout).toBe('flex')
  })
})
