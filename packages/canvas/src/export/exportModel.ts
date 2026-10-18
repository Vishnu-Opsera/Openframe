import type { ExportModel } from './exportTypes.ts'
export function buildExportModelFromSelection(input: { rootNodeId: string }): ExportModel {
  return { exportModelVersion: '1', rootNodeId: input.rootNodeId, tokens: { colors: ['#fff'] }, layout: 'flex', constraints: ['left'], states: ['default'], assets: [{ id: 'asset-1' }], components: [{ id: 'card' }], warnings: [] }
}
