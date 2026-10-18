import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import recentFiles from '../../tests/fixtures/dashboard/recent-files.json'
import { WorkspaceDashboard } from './WorkspaceDashboard'

describe('WorkspaceDashboard', () => {
  it('renders the workspace switcher, file actions, and sync status from fixtures', () => {
    render(<WorkspaceDashboard />)
    expect(screen.getByTestId('workspace-switcher')).toBeInTheDocument()
    expect(screen.getByTestId('file-action-create')).toBeDisabled()
    expect(screen.getByTestId('file-action-open')).toBeDisabled()
    expect(screen.getByTestId('file-action-import')).toBeDisabled()
    expect(screen.getByTestId('sync-status')).toHaveTextContent('Offline')
    expect(screen.getByTestId('recent-files').children).toHaveLength(recentFiles.files.length)
    expect(screen.getByRole('option', { name: 'Northwind Product' })).toBeInTheDocument()
  })

  it('renders an empty recent-file state', () => {
    render(<WorkspaceDashboard recentFiles={[]} />)
    expect(screen.getByTestId('recent-files-empty')).toHaveTextContent('No recent files')
  })

  it('falls back when the selected workspace is missing', () => {
    render(<WorkspaceDashboard selectedWorkspaceId="missing" />)
    expect(screen.getByTestId('workspace-name')).toHaveTextContent('Northwind Product')
  })
})
