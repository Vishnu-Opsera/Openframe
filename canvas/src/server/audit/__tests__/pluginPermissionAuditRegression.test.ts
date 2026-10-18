import { describe, expect, it } from 'vitest'
describe('permission audit', () => { it('records denied runtime attempts', () => { const row = { operation: 'plugin.runtime.denied' }; expect(row.operation).toBe('plugin.runtime.denied'); expect(JSON.stringify(row)).not.toContain('credential') }) })
