import * as Y from 'yjs'
import type { CrdtAdapter, CrdtOperationMetrics, CrdtSnapshot, SemanticMergeIssue } from './crdtAdapter.ts'

interface StoredNode {
  parentId: string | null
  zIndex: number
  x: number
  y: number
}

export function createYjsCrdtAdapter(): CrdtAdapter {
  const document = new Y.Doc()
  const nodes = document.getMap<StoredNode>('nodes')
  let listener: (metrics: CrdtOperationMetrics) => void = () => undefined

  function metrics(operationType: string, updateBytes: number, rejectedUpdates = 0): CrdtOperationMetrics {
    const value = { operationType, updateBytes, appliedUpdates: rejectedUpdates === 0 ? 1 : 0, rejectedUpdates, durationMs: 0 }
    listener(value)
    return value
  }

  return {
    applySceneOperation(operation) {
      const conflicts: SemanticMergeIssue[] = []
      if (operation.parentId && operation.parentId !== 'page' && !nodes.has(operation.parentId) && operation.type !== 'deleteNode') {
        conflicts.push({ code: 'semantic_conflict', nodeId: operation.nodeId })
      }
      document.transact(() => {
        if (operation.type === 'deleteNode') {
          nodes.delete(operation.nodeId)
          return
        }
        if (conflicts.length > 0) {
          return
        }
        const current = nodes.get(operation.nodeId)
        nodes.set(operation.nodeId, {
          parentId: operation.parentId,
          zIndex: operation.zIndex,
          x: operation.type === 'updateTransform' ? operation.x : current?.x ?? operation.x,
          y: operation.type === 'updateTransform' ? operation.y : current?.y ?? operation.y,
        })
      })
      const update = Y.encodeStateAsUpdate(document)
      return { update, snapshotVersion: 'v1', metrics: metrics(operation.type, update.byteLength, conflicts.length) }
    },
    applyRemoteUpdate(update) {
      Y.applyUpdate(document, update)
      return { applied: true, conflicts: [], metrics: metrics('remote', update.byteLength) }
    },
    encodeUpdate() {
      return Y.encodeStateAsUpdate(document)
    },
    encodeStateVector() {
      return Y.encodeStateVector(document)
    },
    exportSnapshot() {
      const snapshot: CrdtSnapshot = { schemaVersion: 'v1', nodes: {} }
      nodes.forEach((value, key) => {
        snapshot.nodes[key] = value
      })
      return snapshot
    },
    importSnapshot(snapshot) {
      if (!snapshot || typeof snapshot !== 'object' || !('schemaVersion' in snapshot) || snapshot.schemaVersion !== 'v1') {
        throw new Error('incompatible_snapshot')
      }
    },
    onMetrics(next) {
      listener = next
    },
  }
}
