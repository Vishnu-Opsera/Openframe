import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildExportModelFromSelection } from './exportModel.ts'
import { generateReactTailwindArtifact } from './reactTailwindExporter.ts'
describe('react exporter', () => {
  it('emits the artifact files', () => {
    const model = buildExportModelFromSelection({ rootNodeId: 'card' })
    const files = generateReactTailwindArtifact(model)
    expect(Object.keys(files)).toEqual(['src/components/SemanticCard.tsx', 'src/components/index.ts', 'tailwind.config.ts', 'package.json', 'export-manifest.json'])
    expect(readFileSync('packages/canvas/src/export/reactTailwindExporter.ts', 'utf8')).not.toContain('sceneGraph')
  })
})
