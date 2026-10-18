import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('hardcoded ui copy', () => {
  it('keeps dashboard and editor titles in catalog keys', () => {
    const dashboard = readFileSync('apps/canvas/src/features/dashboard/WorkspaceDashboard.tsx', 'utf8')
    const editor = readFileSync('apps/canvas/src/features/editor/EditorWorkspace.tsx', 'utf8')
    expect(dashboard).toContain("t('dashboard.title')")
    expect(editor).toContain("t('editor.title')")
  })
})
