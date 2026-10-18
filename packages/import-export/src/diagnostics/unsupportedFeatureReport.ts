export interface UnsupportedFeatureFinding { code: string; severity: 'error' | 'warning' | 'info'; message: string; remediation: string }
export interface RemediationAction { code: string; text: string }
export interface UnsupportedFeatureReport { findings: UnsupportedFeatureFinding[]; severityCounts: { error: number; warning: number; info: number } }
const remediations: Record<string, string> = { SVG_FILTER_UNSUPPORTED: 'Remove the SVG filter or flatten it before import.' }
export function buildUnsupportedFeatureReport(findings: Array<{ code: string; severity: UnsupportedFeatureFinding['severity']; rawPayload?: string }>): UnsupportedFeatureReport {
  const mapped = findings.map((finding) => ({ code: finding.code, severity: finding.severity, message: finding.code, remediation: remediations[finding.code] ?? 'Review the finding.' }))
  const rank = { error: 0, warning: 1, info: 2 }
  mapped.sort((left, right) => rank[left.severity] - rank[right.severity])
  return { findings: mapped, severityCounts: { error: mapped.filter((item) => item.severity === 'error').length, warning: mapped.filter((item) => item.severity === 'warning').length, info: mapped.filter((item) => item.severity === 'info').length } }
}
