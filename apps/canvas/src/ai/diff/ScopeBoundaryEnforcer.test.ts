import { describe, expect, it } from 'vitest'
import { classifyScopeImpact } from './ScopeBoundaryEnforcer.ts'
describe('scope', () => { it('classifies boundaries', () => { expect(classifyScopeImpact('selected').impact).toBe('IN_SCOPE'); expect(classifyScopeImpact('shared').impact).toBe('REQUIRES_EXPANDED_SCOPE'); expect(classifyScopeImpact('unrelated').impact).toBe('BLOCKED') }) })
