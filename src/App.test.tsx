import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../apps/canvas/src/i18n'
import defaultWorkspace from '../tests/fixtures/app-shell/default-workspace.json'
import { App } from './App'

describe('App shell', () => {
  it('renders the shared shell regions from the workspace fixture', () => {
    render(
      <I18nProvider>
        <App />
      </I18nProvider>,
    )

    expect(screen.getByTestId('canvas-app-shell')).toBeInTheDocument()
    expect(screen.getByTestId('canvas-top-bar')).toBeInTheDocument()
    expect(screen.getByTestId('canvas-editor-host')).toBeInTheDocument()
    expect(screen.getByText('Openframe')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: defaultWorkspace.workspaceName })).toBeInTheDocument()
    expect(screen.getByTestId('canvas-sync-label')).toHaveTextContent(defaultWorkspace.syncLabel)
    expect(screen.getByTestId('canvas-editor-host-copy')).toHaveTextContent(
      'No files in this workspace yet',
    )
  })
})
