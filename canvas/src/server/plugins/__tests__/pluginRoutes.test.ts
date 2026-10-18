import { describe, expect, it } from 'vitest'
import { installPlugin } from '../pluginRoutes.ts'
describe('plugin routes', () => { it('rejects an unknown capability', () => { const result = installPlugin({ valid: false, role: 'admin' }); expect(result.status).toBe(400); expect(result.written).toBe(false) }) })
