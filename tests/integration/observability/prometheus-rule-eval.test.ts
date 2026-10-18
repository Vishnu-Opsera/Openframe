import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('prom rules', () => { it('names the websocket burn alert', () => { expect(readFileSync('observability/alerts/collaboration-slo-rules.yaml', 'utf8')).toContain('CanvasWebSocketRelayP95LatencyBudgetBurn') }) })
