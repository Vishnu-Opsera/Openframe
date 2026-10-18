import { describe, expect, it } from 'vitest'
import { runRetentionJob } from '../../services/api/src/jobs/retention/retentionWorker.ts'
describe('retention idempotency', () => { it('repeats the same result', () => { expect(runRetentionJob({ mode: 'execute' })).toEqual(runRetentionJob({ mode: 'execute' })) }) })
