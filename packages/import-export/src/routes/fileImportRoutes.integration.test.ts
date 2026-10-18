import { describe, expect, it } from 'vitest'
import { parsePdfToSceneGraph } from '../parsers/pdfParser.ts'

describe('file import routes', () => {
  it('returns scene graph operations for a pdf', () => {
    expect(parsePdfToSceneGraph('two-page').operations.length).toBeGreaterThan(0)
  })
})
