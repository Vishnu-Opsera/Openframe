import { describe, expect, it } from 'vitest'
import { getSyncStatusLabel } from './syncStatus'

describe('getSyncStatusLabel', () => {
  it('maps known states to stable labels', () => {
    expect(getSyncStatusLabel('offline')).toBe('Offline')
    expect(getSyncStatusLabel('syncing')).toBe('Syncing')
    expect(getSyncStatusLabel('synced')).toBe('Synced')
    expect(getSyncStatusLabel('error')).toBe('Sync needs attention')
  })

  it('uses a safe label for an unknown state', () => {
    expect(getSyncStatusLabel('remote')).toBe('Sync status unknown')
  })
})
