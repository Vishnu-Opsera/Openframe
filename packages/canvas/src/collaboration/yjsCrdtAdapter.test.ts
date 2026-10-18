import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { SceneOperation } from './crdtAdapter.ts'
import { createYjsCrdtAdapter } from './yjsCrdtAdapter.ts'

const operations = JSON.parse(readFileSync('packages/canvas/test-fixtures/crdt/basic-scene-ops.json', 'utf8')) as SceneOperation[]

describe('yjs scene graph adapter', () => {
  it('encodes operations, state vectors, remote updates, and snapshots', () => {
    const adapter = createYjsCrdtAdapter()
    const first = adapter.applySceneOperation(operations[0]!, { documentId: 'doc-1' })
    expect(first.update.byteLength).toBeGreaterThan(0)
    expect(adapter.encodeStateVector().byteLength).toBeGreaterThan(0)
    const remote = createYjsCrdtAdapter()
    expect(remote.applyRemoteUpdate(first.update, 'peer').applied).toBe(true)
    remote.applyRemoteUpdate(first.update, 'peer')
    expect(remote.exportSnapshot().nodes['frame-1']?.parentId).toBe('page')
    expect(() => adapter.importSnapshot({ schemaVersion: 'v0' })).toThrowError(/incompatible_snapshot/)
  })
})
