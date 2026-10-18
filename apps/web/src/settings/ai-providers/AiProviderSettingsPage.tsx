import { AiProviderConfigForm } from './AiProviderConfigForm.tsx'
export function AiProviderSettingsPage({ rows, forbidden = false }: { rows: Array<{ provider_key: string; provider_kind: string; enabled: boolean; model: string; retention_policy: string; status: string; last_validated_at: string }>; forbidden?: boolean }) {
  if (forbidden) return <p>403</p>
  return <section>{rows.map((row) => <p key={row.provider_key}>{row.provider_key} {row.provider_kind} {row.model} {row.retention_policy} {row.status} {row.last_validated_at} {String(row.enabled)}</p>)}<AiProviderConfigForm /></section>
}
