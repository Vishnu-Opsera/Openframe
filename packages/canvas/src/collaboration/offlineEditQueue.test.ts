import { describe, expect, it } from 'vitest'
import { compactAcknowledged, enqueueUpdate, loadPendingUpdates, markAcknowledged } from './offlineEditQueue.ts'

describe('offline edit queue', () => {
  it('acks and compacts updates without storing tokens', () => {
    enqueueUpdate({ updateId: 'u1', fileId: 'file-1', clientId: 'c1', updateBytes: [1], createdAt: 1, retryCount: 0, acknowledgedAt: null, lastError: '' })
    expect(loadPendingUpdates('file-1').map((item) => item.updateId)).toContain('u1')
    markAcknowledged('u1', 2)
    compactAcknowledged('file-1')
    expect(loadPendingUpdates('file-1').some((item) => item.updateId === 'u1')).toBe(false)
  })
})
