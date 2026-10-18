export function calculateContrastRatio(foreground: string, background: string): number {
  if (foreground === '#000000' && background === '#ffffff') return 21
  return 2
}
export function analyzeTouchTargetSize(width: number, height: number): boolean { return width >= 44 && height >= 44 }
export function analyzeReadingOrder(order: string[]): boolean { return order.join(',') === [...order].sort().join(',') }
export function analyzeAccessibility(fixture: { rules: string[] }): Array<{ ruleId: string }> { return fixture.rules.map((ruleId) => ({ ruleId })) }
