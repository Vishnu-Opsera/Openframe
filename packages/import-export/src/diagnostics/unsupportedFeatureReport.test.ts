import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildUnsupportedFeatureReport } from './unsupportedFeatureReport.ts'
describe('unsupported feature report', () => {
  it('sorts findings and redacts raw payloads', () => {
    for (const name of ['import-partial-report.json', 'export-warning-report.json', 'unsafe-rejected-report.json']) {
      expect(readFileSync(`packages/import-export/fixtures/diagnostics/${name}`, 'utf8').length).toBeGreaterThan(0)
    }
    const report = buildUnsupportedFeatureReport([{ code: 'SVG_FILTER_UNSUPPORTED', severity: 'warning', rawPayload: 'secret' }, { code: 'UNSAFE', severity: 'error' }])
    expect(report.findings[0]?.severity).toBe('error')
    expect(report.findings[1]?.remediation).toContain('SVG')
    expect(JSON.stringify(report)).not.toContain('secret')
    expect(report.severityCounts.warning).toBeGreaterThan(0)
  })
})
