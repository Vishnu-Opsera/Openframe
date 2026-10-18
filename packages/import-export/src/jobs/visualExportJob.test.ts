import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getVisualExportJob, runVisualExportJob, type ExportModel } from './visualExportJob.ts'

function model(name: string): ExportModel {
  return JSON.parse(readFileSync(`packages/import-export/fixtures/export/${name}`)) as ExportModel
}

const input = {
  exportModelRef: 'model',
  requestedFormat: 'svg' as const,
  workspaceId: 'workspace-1',
  fileId: 'file-1',
  selectionIds: [],
  requestedBy: 'user-1',
  artifactRetentionHours: 24,
}

describe('visual export job', () => {
  it('returns artifacts and warnings without model contents in logs', () => {
    const svg = runVisualExportJob(input, model('basic-frame.export-model.json'))
    const png = runVisualExportJob({ ...input, requestedFormat: 'png' }, model('mixed-vector-image.export-model.json'))
    const warned = runVisualExportJob({ ...input, requestedFormat: 'pdf' }, model('unsupported-effects.export-model.json'))
    expect(svg.status).toBe(202)
    expect(getVisualExportJob(svg.jobId)?.byteLength).toBeGreaterThan(0)
    expect(getVisualExportJob(png.jobId)?.artifactContentType).toBe('image/png')
    const warning = getVisualExportJob(warned.jobId)
    expect(warning?.status).toBe('succeeded_with_warnings')
    expect(warning?.findings).toContain('EXPORT_EFFECT_UNSUPPORTED')
    expect(JSON.stringify(warning?.log)).not.toContain('authorization')
    expect(JSON.stringify(warning?.log)).not.toContain('nodes')
  })
})
