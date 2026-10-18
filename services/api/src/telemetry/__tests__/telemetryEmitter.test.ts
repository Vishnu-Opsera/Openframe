import { describe, expect, it } from 'vitest'
import { emitTelemetry } from '../telemetryEmitter.ts'
describe('telemetry emitter', () => { it('rejects prompt bodies', () => { expect(emitTelemetry('prompt.submitted', { promptBody: 'secret text' }).ok).toBe(false) }) })
