import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { analyzeAccessibility, calculateContrastRatio } from './accessibilityAnalyzer.ts'
describe('accessibility analyzer', () => {
  it('reports contrast, touch targets, and reading order', () => {
    const violations = JSON.parse(readFileSync('fixtures/quality/accessibility-violations.canvas.json', 'utf8')) as { rules: string[] }
    readFileSync('fixtures/quality/accessibility-clean.canvas.json', 'utf8')
    expect(analyzeAccessibility(violations).map((finding) => finding.ruleId)).toEqual(['a11y.contrast', 'a11y.touch_target', 'a11y.reading_order'])
    expect(calculateContrastRatio('#000000', '#ffffff')).toBe(21)
    expect(calculateContrastRatio('#cccccc', '#ffffff')).toBeLessThan(4.5)
  })
})
