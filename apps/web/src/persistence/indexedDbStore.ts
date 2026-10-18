import { CanvasStorageError, type DocumentMetadata, type LocalDocumentStore, type SnapshotRecord } from '../../../../packages/document-storage/src/index.ts'

export const CANVAS_LOCAL_STORE = 'canvas-local-store'
const STORES = ['documents', 'snapshots', 'crdt_updates', 'metadata_versions'] as const

export type SnapshotValidator = (canvasJson: string) => void

export interface StoreOptions {
  validateSnapshot?: SnapshotValidator
  forceQuotaExceeded?: boolean
}

function defaultValidator(canvasJson: string): void {
  let parsed: { schema_version?: number }
  try {
    parsed = JSON.parse(canvasJson) as { schema_version?: number }
  } catch {
    throw new CanvasStorageError('SCHEMA_VALIDATION_FAILED', 'Snapshot JSON is malformed')
  }
  if (parsed.schema_version !== 1) {
    throw new CanvasStorageError('SCHEMA_VALIDATION_FAILED', 'schema_version is required')
  }
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('indexeddb request failed'))
  })
}

export async function openCanvasLocalStore(options: StoreOptions = {}): Promise<LocalDocumentStore> {
  const validateSnapshot = options.validateSnapshot ?? defaultValidator
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(CANVAS_LOCAL_STORE, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('snapshots')) {
        const store = db.createObjectStore('snapshots', { keyPath: 'id' })
        store.createIndex('document_id', 'documentId')
        store.createIndex('updated_at', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('crdt_updates')) {
        const store = db.createObjectStore('crdt_updates', { keyPath: 'id' })
        store.createIndex('document_id', 'documentId')
        store.createIndex('updated_at', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('metadata_versions')) {
        const store = db.createObjectStore('metadata_versions', { keyPath: 'id' })
        store.createIndex('document_id', 'documentId')
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new CanvasStorageError('OPEN_FAILED', 'Unable to open local store'))
  })

  async function withStore<T>(storeName: string, mode: IDBTransactionMode, run: (store: IDBObjectStore) => Promise<T> | T): Promise<T> {
    if (options.forceQuotaExceeded) {
      throw new CanvasStorageError('QUOTA_EXCEEDED', 'Storage quota exceeded')
    }
    const transaction = database.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    return run(store)
  }

  return {
    async saveDocumentMetadata(metadata) {
      await withStore('documents', 'readwrite', (store) => requestToPromise(store.put(metadata)))
    },
    async saveSnapshot(documentId, snapshot) {
      try {
        validateSnapshot(snapshot.canvasJson)
      } catch (error) {
        if (error instanceof CanvasStorageError) {
          throw error
        }
        throw new CanvasStorageError('SCHEMA_VALIDATION_FAILED', 'Snapshot failed schema validation', documentId)
      }
      const record: SnapshotRecord = {
        id: `${documentId}:${snapshot.canvasJson.length}`,
        documentId,
        updatedAt: new Date().toISOString(),
        canvasJson: snapshot.canvasJson,
        bytes: snapshot.bytes,
      }
      await withStore('snapshots', 'readwrite', (store) => requestToPromise(store.put(record)))
      await withStore('metadata_versions', 'readwrite', (store) =>
        requestToPromise(store.put({ id: record.id, documentId, updatedAt: record.updatedAt })),
      )
    },
    async loadLatestSnapshot(documentId) {
      const records = await withStore('snapshots', 'readonly', (store) => requestToPromise(store.getAll()))
      const matches = (records as SnapshotRecord[])
        .filter((record) => record.documentId === documentId)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      return matches[0] ?? null
    },
    async listDocuments() {
      const records = await withStore('documents', 'readonly', (store) => requestToPromise(store.getAll()))
      return records as DocumentMetadata[]
    },
    async deleteDocument(documentId) {
      for (const storeName of STORES) {
        const records = await withStore(storeName, 'readonly', (store) => requestToPromise(store.getAll()))
        for (const record of records as Array<{ id: string; documentId?: string }>) {
          if (record.id === documentId || record.documentId === documentId) {
            await withStore(storeName, 'readwrite', (store) => requestToPromise(store.delete(record.id)))
          }
        }
      }
    },
  }
}

export const saveDocumentMetadata = async (metadata: DocumentMetadata) => (await openCanvasLocalStore()).saveDocumentMetadata(metadata)
export const saveSnapshot = async (documentId: string, snapshot: { canvasJson: string; bytes: Uint8Array }) =>
  (await openCanvasLocalStore()).saveSnapshot(documentId, snapshot)
export const loadLatestSnapshot = async (documentId: string) => (await openCanvasLocalStore()).loadLatestSnapshot(documentId)
export const listDocuments = async () => (await openCanvasLocalStore()).listDocuments()
export const deleteDocument = async (documentId: string) => (await openCanvasLocalStore()).deleteDocument(documentId)
