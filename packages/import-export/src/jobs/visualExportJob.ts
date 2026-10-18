import { exportPdf } from '../exporters/pdfExporter.ts'
import { exportPng } from '../exporters/pngExporter.ts'
import { exportSvg } from '../exporters/svgExporter.ts'

export interface VisualExportJobInput {
  exportModelRef: string
  requestedFormat: 'svg' | 'png' | 'pdf'
  workspaceId: string
  fileId: string
  selectionIds: string[]
  requestedBy: string
  artifactRetentionHours: number
}

export interface ExportModel {
  nodes: Array<{ name: string }>
  effects?: string[]
}

interface StoredJob {
  status: 'succeeded' | 'succeeded_with_warnings'
  artifactRef: string
  artifactContentType: string
  byteLength: number
  findings: string[]
  log: Record<string, string | number>
}

const jobs = new Map<string, StoredJob>()
let sequence = 0

export function runVisualExportJob(input: VisualExportJobInput, model: ExportModel): { status: number; jobId: string } {
  const started = Date.now()
  const bytes = input.requestedFormat === 'png' ? exportPng(model) : input.requestedFormat === 'pdf' ? exportPdf(model) : exportSvg(model)
  const warnings = model.effects?.includes('unsupported') ? ['EXPORT_EFFECT_UNSUPPORTED'] : []
  const jobId = `job-${++sequence}`
  jobs.set(jobId, {
    status: warnings.length > 0 ? 'succeeded_with_warnings' : 'succeeded',
    artifactRef: `secret-free://${input.workspaceId}/${jobId}`,
    artifactContentType: input.requestedFormat === 'svg' ? 'image/svg+xml' : input.requestedFormat === 'png' ? 'image/png' : 'application/pdf',
    byteLength: bytes.byteLength,
    findings: warnings,
    log: {
      jobId,
      fileId: input.fileId,
      workspaceId: input.workspaceId,
      requestedFormat: input.requestedFormat,
      durationMs: Date.now() - started,
      artifactByteLength: bytes.byteLength,
      status: warnings.length > 0 ? 'succeeded_with_warnings' : 'succeeded',
    },
  })
  return { status: 202, jobId }
}

export function getVisualExportJob(jobId: string): StoredJob | undefined {
  return jobs.get(jobId)
}
