import { createHash } from 'node:crypto'
import type { ArtifactType } from './artifacts.ts'

export interface ObjectStoreConfig {
  endpoint: string
  bucket: string
  region: string
  credentialRef: string
}

export interface StoredObject {
  objectKey: string
  checksum: string
  sizeBytes: number
}

export interface ObjectStore {
  putObject(artifactType: ArtifactType, fileId: string, bytes: Uint8Array, checksum: string): StoredObject
  getObjectMetadata(objectKey: string): StoredObject
  deleteObject(objectKey: string): void
  createSignedReadUrl(objectKey: string): string
}

export function createMemoryObjectStore(config: ObjectStoreConfig | undefined): ObjectStore {
  if (!config?.endpoint || !config.bucket || !config.credentialRef.startsWith('secret://')) {
    throw new Error('missing_storage_configuration')
  }
  const objects = new Map<string, StoredObject>()
  return {
    putObject(artifactType, fileId, bytes, checksum) {
      const actual = createHash('sha256').update(bytes).digest('hex')
      if (actual !== checksum) {
        throw new Error('checksum_mismatch')
      }
      const stored = { objectKey: `${config.bucket}/${artifactType}/${fileId}/${actual.slice(0, 8)}`, checksum, sizeBytes: bytes.byteLength }
      objects.set(stored.objectKey, stored)
      return stored
    },
    getObjectMetadata(objectKey) {
      const found = objects.get(objectKey)
      if (!found) {
        throw new Error('missing_object')
      }
      return found
    },
    deleteObject(objectKey) {
      objects.delete(objectKey)
    },
    createSignedReadUrl(objectKey) {
      return `${config.endpoint}/${objectKey}?signature=redacted`
    },
  }
}

export function storageStatus(error: unknown): { status: number; code: string } {
  const message = error instanceof Error ? error.message : 'provider_unavailable'
  if (message === 'missing_object') {
    return { status: 404, code: 'missing_object' }
  }
  if (message === 'checksum_mismatch') {
    return { status: 400, code: 'checksum_mismatch' }
  }
  return { status: 503, code: 'provider_unavailable' }
}
