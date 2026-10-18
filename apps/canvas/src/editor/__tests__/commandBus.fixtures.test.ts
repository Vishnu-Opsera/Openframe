import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('command bus fixtures', () => {
  it('loads the committed scene and image fixtures', () => {
    const scene = JSON.parse(readFileSync('fixtures/canvas/core-command-bus-basic.canvas.json', 'utf8')) as { document_id: string }
    const image = readFileSync('fixtures/images/sample-placement.png')
    expect(scene.document_id).toBe('doc-commands')
    expect(image.byteLength).toBeGreaterThan(8)
  })
})
