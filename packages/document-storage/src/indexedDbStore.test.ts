import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { deleteDocument, listDocuments, loadLatestSnapshot, openCanvasLocalStore, saveDocumentMetadata, saveSnapshot } from '../../../apps/web/src/persistence/indexedDbStore.ts'
import { CanvasStorageError } from './index.ts'

const valid = readFileSync('apps/web/tests/fixtures/indexeddb/local-document-v1.json', 'utf8')
const invalid = readFileSync('apps/web/tests/fixtures/indexeddb/invalid-document.json', 'utf8')
const bytes = new Uint8Array(readFileSync('apps/web/tests/fixtures/indexeddb/crdt-snapshot.bin'))

describe('indexedDbStore', () => {
  it('saves metadata and snapshots and lists an empty store first', async () => {
    const empty = await openCanvasLocalStore()
    expect(await empty.listDocuments()).toEqual([])
    await saveDocumentMetadata({ id: 'doc-local', name: 'Local', updatedAt: '2026-03-15T00:00:00Z' })
    await saveSnapshot('doc-local', { canvasJson: valid, bytes })
    const loaded = await loadLatestSnapshot('doc-local')
    expect(loaded?.documentId).toBe('doc-local')
    expect((await listDocuments()).map((item) => item.id)).toContain('doc-local')
    await deleteDocument('doc-local')
    expect(await loadLatestSnapshot('doc-local')).toBeNull()
  })

  it('rejects invalid canvas json before writing metadata versions', async () => {
    await expect(saveSnapshot('doc-invalid', { canvasJson: invalid, bytes })).rejects.toBeInstanceOf(CanvasStorageError)
    await expect(saveSnapshot('doc-invalid', { canvasJson: invalid, bytes })).rejects.toMatchObject({ code: 'SCHEMA_VALIDATION_FAILED' })
  })
})
