import { describe, expect, it } from 'vitest'
import { telemetryEvents } from '../telemetryRegistry.ts'
describe('telemetry registry', () => { it('classifies events', () => { expect(telemetryEvents['editor.opened']).toBe('opt_in_analytics'); expect(telemetryEvents['sync.relay.latency']).toBe('required_operational_reliability') }) })
