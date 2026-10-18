import { describe, expect, it } from 'vitest'
import { ready } from '../../../services/api-gateway/src/health.ts'
describe('telemetry smoke', () => { it('fails ready when postgres is down', () => { expect(ready(false).status).toBe(503) }) })
