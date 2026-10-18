import { checkFilePermission, type FilePermissionRow } from '../auth/filePermissions.ts'
import { forbidden, toErrorResponse } from '../gateway/errors.ts'
import { artifactTypes, retentionFor, type ArtifactType } from '../storage/artifacts.ts'
import { createMemoryObjectStore, storageStatus, type ObjectStoreConfig } from '../storage/objectStore.ts'

export function handleArtifactUpload(input: {
  fileId: string
  actorUserId: string
  artifactType: string
  bytes: Uint8Array
  checksum: string
  rows: FilePermissionRow[]
  config: ObjectStoreConfig
}) {
  if (!artifactTypes.includes(input.artifactType as ArtifactType)) {
    return { status: 400, body: { code: 'invalid_artifact' } }
  }
  const artifactType = input.artifactType as ArtifactType
  const action = artifactType === 'export_artifact' ? 'export' : 'edit'
  const decision = checkFilePermission({ actorUserId: input.actorUserId, designFileId: input.fileId, action, rows: input.rows })
  if (!decision.allowed) {
    const error = toErrorResponse(forbidden('Artifact permission denied', 'req-artifact'), 'req-artifact')
    return { status: error.statusCode, body: error.body }
  }
  try {
    const store = createMemoryObjectStore(input.config)
    const stored = store.putObject(artifactType, input.fileId, input.bytes, input.checksum)
    return {
      status: 201,
      body: {
        artifact_type: artifactType,
        object_key: stored.objectKey,
        checksum: stored.checksum,
        size_bytes: stored.sizeBytes,
        retention_expires_at: retentionFor(artifactType),
      },
    }
  } catch (error) {
    const mapped = storageStatus(error)
    return { status: mapped.status, body: { code: mapped.code } }
  }
}
