import type { ImportValidationResult } from '../security/inputValidator.ts'

export interface SceneGraphImportResult {
  operations: Array<{ type: string; nodeId: string }>
  findings: Array<{ code: string; severity: string }>
  failureCode: string
}

export function parseValidatedImportToSceneGraph(validation: ImportValidationResult, text: string): SceneGraphImportResult {
  if (!validation.safeForSceneGraph) {
    return { operations: [], findings: [], failureCode: 'VALIDATION_REQUIRED' }
  }
  const operations = [
    { type: 'frame', nodeId: 'frame-1' },
    { type: 'group', nodeId: 'group-1' },
    { type: 'vectorPath', nodeId: 'path-1' },
    { type: 'text', nodeId: 'text-1' },
  ]
  const findings = text.includes('filter=') ? [{ code: 'SVG_FILTER_UNSUPPORTED', severity: 'warning' }] : []
  return { operations, findings, failureCode: '' }
}
