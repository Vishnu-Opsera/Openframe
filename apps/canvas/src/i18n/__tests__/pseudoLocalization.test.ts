import { describe, expect, it } from 'vitest'
import { preservePlaceholder, pseudoLocalize } from '../pseudo.ts'

describe('pseudo localization', () => {
  it('expands text and keeps placeholders', () => {
    expect(pseudoLocalize('Workspace').length).toBeGreaterThan('Workspace'.length)
    expect(preservePlaceholder('Files {count}', '{count}')).toBe(true)
  })
})
