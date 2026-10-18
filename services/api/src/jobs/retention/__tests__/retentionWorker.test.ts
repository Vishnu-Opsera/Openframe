import { describe, expect, it } from 'vitest'
import { runRetentionJob } from '../retentionWorker.ts'
describe('retention worker', () => { it('dry-runs without deletes', () => { const result = runRetentionJob({ mode: 'dry-run' }); expect(result.deletedCount).toBe(0); expect(result.candidates.length).toBeGreaterThan(0) }) })
