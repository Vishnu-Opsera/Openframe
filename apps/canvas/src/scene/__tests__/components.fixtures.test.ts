import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('component fixtures', () => {
  it('loads variant and override fixtures', () => {
    const variants = JSON.parse(readFileSync('fixtures/canvas/components-variants-props.canvas.json', 'utf8')) as { variants: string[] }
    const overrides = JSON.parse(readFileSync('fixtures/canvas/component-instance-overrides.canvas.json', 'utf8')) as { override: string }
    expect(variants.variants).toContain('primary')
    expect(overrides.override).toBe('label')
  })
})
