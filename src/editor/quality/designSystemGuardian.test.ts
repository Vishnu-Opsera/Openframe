import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { analyzeDesignSystemGuardian } from './designSystemGuardian.ts'
describe('guardian', () => { it('reports drift and a clean file', () => { const violations = JSON.parse(readFileSync('fixtures/quality/design-system-violations.canvas.json', 'utf8')) as { rules: string[] }; const clean = JSON.parse(readFileSync('fixtures/quality/design-system-clean.canvas.json', 'utf8')) as { rules: string[] }; expect(analyzeDesignSystemGuardian(violations).map((finding) => finding.ruleId)).toEqual(['guardian.detached_instance', 'guardian.off_token_color', 'guardian.inconsistent_spacing']); expect(analyzeDesignSystemGuardian(clean)).toEqual([]) }) })
