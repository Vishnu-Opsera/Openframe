import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { CANVAS_LOCAL_STORE, openCanvasLocalStore } from '../src/persistence/indexedDbStore.ts'
import { CanvasStorageError } from '../../../packages/document-storage/src/index.ts'

describe('indexeddb-persistence', () => {
  it('creates the local object stores and rejects invalid documents', async () => {
    await openCanvasLocalStore()
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(CANVAS_LOCAL_STORE)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    expect([...database.objectStoreNames]).toEqual(expect.arrayContaining(['documents', 'snapshots', 'crdt_updates', 'metadata_versions']))
    const invalid = readFileSync('apps/web/tests/fixtures/indexeddb/invalid-document.json', 'utf8')
    const store = await openCanvasLocalStore()
    await expect(store.saveSnapshot('doc-invalid', { canvasJson: invalid, bytes: new Uint8Array([1]) })).rejects.toMatchObject({
      code: 'SCHEMA_VALIDATION_FAILED',
    })
    await expect(store.saveSnapshot('doc-invalid', { canvasJson: invalid, bytes: new Uint8Array([1]) })).rejects.toBeInstanceOf(CanvasStorageError)
  })
})
