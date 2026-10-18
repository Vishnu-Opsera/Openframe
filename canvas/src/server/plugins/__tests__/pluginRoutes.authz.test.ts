import { describe, expect, it } from 'vitest'
import { installPlugin } from '../pluginRoutes.ts'
describe('plugin authz', () => { it('rejects missing and non-admin sessions', () => { expect(installPlugin({ valid: true, role: 'anonymous' }).code).toBe('UNAUTHENTICATED'); expect(installPlugin({ valid: true, role: 'member' }).code).toBe('FORBIDDEN') }) })
