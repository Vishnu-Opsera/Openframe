import { describe, expect, it } from 'vitest'
import { calculatePixelDiffPercent } from './pixelDiff.ts'
describe('pixel diff', () => { it('is zero for identical images', () => { expect(calculatePixelDiffPercent('a', 'a')).toBe(0); expect(calculatePixelDiffPercent('a', 'b')).toBeGreaterThan(1) }) })
