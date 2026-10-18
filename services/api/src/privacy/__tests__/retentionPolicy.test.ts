import { describe, expect, it } from 'vitest'
import { retentionPolicies } from '../retentionPolicy.ts'
describe('retention policy', () => { it('keeps audit events for a year', () => { expect(retentionPolicies.audit_events_1_year_minimum.days).toBeGreaterThanOrEqual(365); expect(retentionPolicies.export_artifacts_24h.hours).toBe(24) }) })
