import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UnsupportedFeaturePanel } from './UnsupportedFeaturePanel.tsx'
describe('unsupported feature panel', () => {
  it('renders a rejected report without raw content', () => {
    const fixture = JSON.parse(readFileSync('packages/import-export/fixtures/diagnostics/unsafe-rejected-report.json', 'utf8')) as { jobId: string; status: string; findings: Array<{ code: string; remediation: string }> }
    render(<UnsupportedFeaturePanel report={fixture} />)
    expect(screen.getByText(fixture.jobId)).toBeInTheDocument()
    expect(screen.getByText('no raw content disclosed')).toBeInTheDocument()
  })
})
