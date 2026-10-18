import { describe, expect, it } from 'vitest'
import { getImportExportReport } from './importExportDiagnostics.ts'
describe('import export diagnostics', () => {
  it('returns reports and auth errors', () => {
    const imported = getImportExportReport('import', 'import-1')
    const exported = getImportExportReport('export', 'export-1')
    expect(imported.status).toBe(200)
    expect((imported.body as { report: { findings: Array<{ message: string }> } }).report.findings[0]?.message).toBeTruthy()
    expect((exported.body as { report: { severityCounts: { warning: number } } }).report.severityCounts.warning).toBeGreaterThan(0)
    expect(getImportExportReport('import', 'missing').status).toBe(404)
    expect(getImportExportReport('import', 'denied').status).toBe(403)
  })
})
