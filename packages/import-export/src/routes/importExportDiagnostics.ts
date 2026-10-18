import { buildUnsupportedFeatureReport } from '../diagnostics/unsupportedFeatureReport.ts'
const reports: Record<string, { kind: 'import' | 'export'; authorized: boolean }> = { 'import-1': { kind: 'import', authorized: true }, 'export-1': { kind: 'export', authorized: true }, 'denied': { kind: 'import', authorized: false } }
export function getImportExportReport(kind: 'import' | 'export', jobId: string): { status: number; body: unknown } {
  const record = reports[jobId]
  if (!record || record.kind !== kind) return { status: 404, body: { error: { code: 'not_found' } } }
  if (!record.authorized) return { status: 403, body: { error: { code: 'forbidden' } } }
  const report = buildUnsupportedFeatureReport(kind === 'export' ? [{ code: 'EXPORT_EFFECT_UNSUPPORTED', severity: 'warning' }] : [{ code: 'SVG_FILTER_UNSUPPORTED', severity: 'warning' }])
  return { status: 200, body: { report } }
}
