// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { WebSocketSyncClient } from './webSocketSyncClient.ts'
import { startMockSyncServer } from '../../test-fixtures/sync/mock-sync-server.ts'

describe('websocket sync integration', () => {
  it('exchanges a binary update between two local clients', async () => {
    const frame = new Uint8Array(readFileSync('packages/canvas/test-fixtures/sync/crdt-update-frame.bin'))
    const server = await startMockSyncServer()
    const received: Uint8Array[] = []
    const left = new WebSocketSyncClient({
      url: server.url,
      adapter: { applyRemoteUpdate: (update) => ({ applied: true, conflicts: [], metrics: { operationType: 'remote', updateBytes: update.byteLength, appliedUpdates: 1, rejectedUpdates: 0, durationMs: 0 } }) },
      tokenProvider: async () => 'left',
    })
    const right = new WebSocketSyncClient({
      url: server.url,
      adapter: { applyRemoteUpdate: (update) => { received.push(update); return { applied: true, conflicts: [], metrics: { operationType: 'remote', updateBytes: update.byteLength, appliedUpdates: 1, rejectedUpdates: 0, durationMs: 0 } } } },
      tokenProvider: async () => 'right',
    })
    await Promise.all([left.connect(), right.connect()])
    await new Promise((resolve) => setTimeout(resolve, 30))
    left.sendUpdate(frame)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(Array.from(received[0] ?? [])).toEqual(Array.from(frame))
    left.dispose()
    right.dispose()
    await server.close()
  })
})
