import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('text fixtures', () => {
  it('loads variable font metadata', () => {
    const text = JSON.parse(readFileSync('fixtures/canvas/text-variable-font.canvas.json', 'utf8')) as { axis: string }
    const font = JSON.parse(readFileSync('fixtures/fonts/inter-variable-font-metadata.json', 'utf8')) as { family: string }
    expect(text.axis).toBe('wght')
    expect(font.family).toBe('Inter')
  })
})
