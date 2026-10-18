import { describe, expect, it } from 'vitest'
import { parseRasterImageToSceneGraph } from './rasterImageParser.ts'

describe('raster parser', () => {
  it('creates image nodes for png and jpg', () => {
    expect(parseRasterImageToSceneGraph('sample.png', 'image/png').width).toBe(2)
    expect(parseRasterImageToSceneGraph('sample.jpg', 'image/jpeg').mimeType).toBe('image/jpeg')
  })
})
