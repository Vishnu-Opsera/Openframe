export const artifactTypes = ['blob', 'file_version', 'thumbnail', 'import_asset', 'export_artifact'] as const

export type ArtifactType = (typeof artifactTypes)[number]

export function retentionFor(artifactType: ArtifactType): string {
  return artifactType === 'thumbnail' ? '2026-11-17T00:00:00Z' : '2027-10-17T00:00:00Z'
}
