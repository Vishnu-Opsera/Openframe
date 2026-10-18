export interface DocumentMetadata {
  id: string
  name: string
  updatedAt: string
}

export interface SnapshotRecord {
  id: string
  documentId: string
  updatedAt: string
  canvasJson: string
  bytes: Uint8Array
}

export interface CrdtUpdateRecord {
  id: string
  documentId: string
  updatedAt: string
  bytes: Uint8Array
}

export type CanvasStorageErrorCode =
  | 'SCHEMA_VALIDATION_FAILED'
  | 'QUOTA_EXCEEDED'
  | 'NOT_FOUND'
  | 'OPEN_FAILED'
  | 'SERIALIZATION_FAILED'
  | 'UNKNOWN_INDEXEDDB_ERROR'

export class CanvasStorageError extends Error {
  readonly code: CanvasStorageErrorCode
  readonly documentId: string | undefined

  constructor(code: CanvasStorageErrorCode, message: string, documentId?: string) {
    super(message)
    this.name = 'CanvasStorageError'
    this.code = code
    this.documentId = documentId
  }
}

export interface LocalDocumentStore {
  saveDocumentMetadata(metadata: DocumentMetadata): Promise<void>
  saveSnapshot(documentId: string, snapshot: { canvasJson: string; bytes: Uint8Array }): Promise<void>
  loadLatestSnapshot(documentId: string): Promise<SnapshotRecord | null>
  listDocuments(): Promise<DocumentMetadata[]>
  deleteDocument(documentId: string): Promise<void>
}
