import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseSvg } from './svgParser.ts'

describe('svg parser', () => {
  it('warns on unsupported filters', () => {
    const result = parseSvg(new Uint8Array(readFileSync('packages/import-export/fixtures/import/svg/unsupported-filter.svg')))
    expect(result.findings[0]?.code).toBe('SVG_FILTER_UNSUPPORTED')
    expect(result.operations.length).toBeGreaterThan(0)
  })
})
