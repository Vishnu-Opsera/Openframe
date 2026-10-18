import { parseValidatedImportToSceneGraph, type SceneGraphImportResult } from './importToSceneGraph.ts'
import { validateImportPayload } from '../security/inputValidator.ts'

export function parseSvg(bytes: Uint8Array): SceneGraphImportResult {
  const validation = validateImportPayload(bytes, 'image/svg+xml')
  return parseValidatedImportToSceneGraph(validation, new TextDecoder().decode(bytes))
}
