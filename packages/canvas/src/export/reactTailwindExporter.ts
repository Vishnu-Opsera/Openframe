import type { ExportModel } from './exportTypes.ts'
export function generateReactTailwindArtifact(_model: ExportModel): Record<string, string> {
  return { 'src/components/SemanticCard.tsx': 'export function SemanticCard(){return null}', 'src/components/index.ts': 'export {}', 'tailwind.config.ts': 'export default {}', 'package.json': '{}', 'export-manifest.json': '{"artifactType":"react-tailwind"}' }
}
