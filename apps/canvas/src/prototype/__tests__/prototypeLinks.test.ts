import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createPrototypeLink, removePrototypeLink, updateTransition, validatePrototypeTarget, type PrototypeLink } from '../prototypeLinks.ts'

describe('prototype links', () => {
  it('creates, updates, and removes links', () => {
    const fixture = JSON.parse(readFileSync('fixtures/canvas/prototypes-comments-versions.canvas.json', 'utf8')) as { source: string }
    const links: PrototypeLink[] = []
    expect(validatePrototypeTarget(fixture.source, 'frame-2')).toBe(true)
    const created = createPrototypeLink(links, fixture.source, 'frame-2')
    expect('id' in created).toBe(true)
    if ('id' in created) {
      updateTransition(created, 'slide', 300)
      expect(removePrototypeLink(links, created.id)).toHaveLength(0)
    }
  })
})
