import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('slo dashboard', () => { it('includes thresholds', () => { const dashboard = readFileSync('observability/dashboards/collaboration-slo.json', 'utf8'); expect(dashboard).toContain('REST metadata p95 latency'); expect(dashboard).toContain('200'); expect(dashboard).toContain('150'); expect(dashboard).toContain('250'); expect(dashboard).toContain('primary') }) })
