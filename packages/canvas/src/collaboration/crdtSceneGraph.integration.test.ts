import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { SceneOperation } from './crdtAdapter.ts'
import { createYjsCrdtAdapter } from './yjsCrdtAdapter.ts'

describe('crdt scene graph convergence', () => {
  it('converges node identity, parent, z-order, and transform across two documents', () => {
    const operations = JSON.parse(readFileSync('packages/canvas/test-fixtures/crdt/basic-scene-ops.json', 'utf8')) as SceneOperation[]
    const left = createYjsCrdtAdapter()
    const right = createYjsCrdtAdapter()
    for (const operation of operations.slice(0, 4)) {
      const update = left.applySceneOperation(operation, { documentId: 'doc-1' }).update
      right.applyRemoteUpdate(update, 'left')
    }
    const leftSnapshot = left.exportSnapshot()
    const rightSnapshot = right.exportSnapshot()
    expect(rightSnapshot.nodes['shape-1']).toEqual(leftSnapshot.nodes['shape-1'])
    expect(rightSnapshot.nodes['shape-1']?.parentId).toBe('page')
    expect(rightSnapshot.nodes['shape-1']?.zIndex).toBe(2)
    expect(rightSnapshot.nodes['shape-1']?.x).toBe(12)
  })
})
