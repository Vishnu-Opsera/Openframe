import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { enqueueUpdate } from './offlineEditQueue.ts'
import { acknowledgeReplay, verifyConvergence } from './reconnectConvergenceFlow.ts'

describe('offline reconnect integration', () => {
  it('replays queued updates after reconnect', () => {
    const sequence = JSON.parse(readFileSync('packages/canvas/test-fixtures/offline/offline-update-sequence.json', 'utf8')) as { updates: string[] }
    for (const updateId of sequence.updates) {
      enqueueUpdate({ updateId, fileId: 'file-3', clientId: 'c1', updateBytes: [1], createdAt: 1, retryCount: 0, acknowledgedAt: null, lastError: '' })
    }
    expect(acknowledgeReplay('file-3', 4, { replayBatchSize: 3, unauthorized: false })).toBe(3)
    expect(verifyConvergence('snapshot', 'snapshot')).toBe(true)
  })
})
