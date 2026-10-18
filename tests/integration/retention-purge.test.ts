import { describe, expect, it } from 'vitest'
import { runRetentionJob } from '../../services/api/src/jobs/retention/retentionWorker.ts'
describe('retention purge', () => { it('expires presence prefixes without deleting fresh audits', () => { expect(runRetentionJob({ mode: 'execute' }).deletedCount).toBe(1) }) })
