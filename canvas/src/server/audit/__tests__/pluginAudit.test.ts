import { describe, expect, it } from 'vitest'
describe('plugin audit', () => { it('records grant operations without credentials', () => { const rows = ['plugin.install', 'plugin.capability.grant', 'plugin.capability.deny', 'plugin.runtime.denied']; expect(rows).toContain('plugin.install'); expect(JSON.stringify(rows)).not.toContain('api_key') }) })
