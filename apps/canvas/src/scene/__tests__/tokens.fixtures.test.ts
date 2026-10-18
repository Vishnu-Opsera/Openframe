import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('token fixtures', () => {
  it('loads light and dark fixtures', () => {
    const tokens = JSON.parse(readFileSync('fixtures/canvas/tokens-light-dark.canvas.json', 'utf8')) as { modes: string[] }
    expect(tokens.modes).toEqual(['light', 'dark'])
  })
})
