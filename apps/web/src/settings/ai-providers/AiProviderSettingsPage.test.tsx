import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { validateProviderForm } from './AiProviderConfigForm.tsx'
import { AiProviderSettingsPage } from './AiProviderSettingsPage.tsx'
describe('ai provider settings', () => {
  it('renders rows without the placeholder key and validates required fields', () => {
    render(<AiProviderSettingsPage rows={[{ provider_key: 'anthropic', provider_kind: 'anthropic_claude', enabled: true, model: 'claude', retention_policy: 'none', status: 'ready', last_validated_at: '2026-01-01' }]} />)
    expect(screen.getByText(/anthropic/)).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('<your-api-key>')
    expect(validateProviderForm({ provider_kind: 'local_model' })).toContain('endpoint_url')
    expect(validateProviderForm({ provider_kind: 'anthropic_claude' })).toContain('secret_ref')
  })
})
