export function UnsupportedFeaturePanel({ report }: { report: { jobId: string; status: string; findings: Array<{ code: string; remediation: string }> } }) {
  const finding = report.findings[0]
  return <section><p>{report.jobId}</p><p>{report.status}</p><p>{finding?.code}</p><p>{finding?.remediation}</p><p>no raw content disclosed</p></section>
}
