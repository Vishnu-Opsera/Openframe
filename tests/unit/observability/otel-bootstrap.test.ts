import { describe, expect, it } from 'vitest'
import { initializeOpenTelemetry } from '../../../packages/observability/src/otel.ts'
describe('otel bootstrap', () => { it('creates providers', () => { const result = initializeOpenTelemetry({ endpoint: 'http://otel-collector:4318' }); expect(result.tracer).toBe(true); expect(result.meter).toBe(true) }) })
