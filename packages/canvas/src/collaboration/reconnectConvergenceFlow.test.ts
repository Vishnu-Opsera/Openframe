import { describe, expect, it } from 'vitest'
import { enqueueUpdate } from './offlineEditQueue.ts'
import { acknowledgeReplay, replayPendingUpdates, verifyConvergence } from './reconnectConvergenceFlow.ts'

describe('reconnect convergence', () => {
  it('caps replay batches and stops when unauthorized', () => {
    enqueueUpdate({ updateId: 'u2', fileId: 'file-2', clientId: 'c1', updateBytes: [1], createdAt: 1, retryCount: 0, acknowledgedAt: null, lastError: '' })
    enqueueUpdate({ updateId: 'u3', fileId: 'file-2', clientId: 'c1', updateBytes: [2], createdAt: 2, retryCount: 0, acknowledgedAt: null, lastError: '' })
    expect(replayPendingUpdates('file-2', { replayBatchSize: 1, unauthorized: false })).toHaveLength(1)
    expect(replayPendingUpdates('file-2', { replayBatchSize: 2, unauthorized: true })).toHaveLength(0)
    expect(acknowledgeReplay('file-2', 3, { replayBatchSize: 1, unauthorized: false })).toBe(1)
    expect(verifyConvergence('same', 'same')).toBe(true)
  })
})
