import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createMemoryObjectStore, storageStatus } from '../objectStore.ts'

const config = (JSON.parse(readFileSync('apps/server/test/fixtures/object_storage.fixture.json', 'utf8')) as { config: { endpoint: string; bucket: string; region: string; credentialRef: string } }).config

describe('object store', () => {
  it('builds keys, rejects checksum mismatches, and deletes objects', () => {
    const bytes = new Uint8Array([1, 2, 3])
    const checksum = createHash('sha256').update(bytes).digest('hex')
    const store = createMemoryObjectStore(config)
    const stored = store.putObject('blob', 'file-1', bytes, checksum)
    expect(stored.objectKey).toContain('blob/file-1')
    expect(store.createSignedReadUrl(stored.objectKey)).not.toContain('secret://')
    expect(() => store.putObject('blob', 'file-1', bytes, 'nope')).toThrowError(/checksum_mismatch/)
    store.deleteObject(stored.objectKey)
    expect(storageStatus(new Error('missing_object')).status).toBe(404)
    expect(() => createMemoryObjectStore(undefined)).toThrowError(/missing_storage_configuration/)
  })
})
