import { describe, expect, it } from 'vitest'
import { restoreDrill } from '../../../infrastructure/backup/restore-drill.ts'
describe('restore drill', () => { it('reports success', () => { expect(restoreDrill().result).toBe('success') }) })
