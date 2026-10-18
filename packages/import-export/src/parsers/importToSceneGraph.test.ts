import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseSvg } from './svgParser.ts'

describe('import to scene graph', () => {
  it('converts basic svg shapes', () => {
    const result = parseSvg(new Uint8Array(readFileSync('packages/import-export/fixtures/import/svg/basic-shapes.svg')))
    expect(result.operations.map((operation) => operation.type)).toEqual(['frame', 'group', 'vectorPath', 'text'])
  })
})
