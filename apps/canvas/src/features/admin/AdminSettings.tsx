export function AdminSettings({ optedOut }: { optedOut: boolean }) {
  return <section><button type="button" data-testid="analytics-opt-in-toggle" aria-pressed={!optedOut}>analytics</button><p data-testid="required-telemetry-notice">Required telemetry stays on.</p></section>
}
