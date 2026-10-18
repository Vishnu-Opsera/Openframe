import { describe, expect, it } from 'vitest'
import { parseWorkspace } from './workspace'

describe('parseWorkspace', () => {
  it('rejects a malformed fixture without throwing', () => {
    const result = parseWorkspace({ workspaceName: 'Openframe' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.message).toContain('malformed')
    }
  })

  it('treats an empty file list as a valid workspace', () => {
    const result = parseWorkspace({
      workspaceName: 'Empty',
      syncLabel: 'Local only',
      files: [],
    })
    expect(result.ok).toBe(true)
  })
})
