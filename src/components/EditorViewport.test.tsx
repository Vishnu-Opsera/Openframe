import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorViewport } from './EditorViewport'

describe('EditorViewport', () => {
  it('shows the ready state after the editor core loads', async () => {
    render(
      <EditorViewport
        loader={async () => ({
          status: 'ready',
          version: '0.1.0',
          capabilities: ['status'],
          renderer_boundary: 'external',
        })}
      />,
    )
    expect(await screen.findByTestId('editor-core-ready')).toBeInTheDocument()
  })

  it('shows the error state when loading is rejected', async () => {
    render(
      <EditorViewport
        loader={async () => ({
          status: 'error',
          code: 'wasm_artifact_missing',
          message: 'Openframe could not load the editor core.',
          recoverable: false,
        })}
      />,
    )
    expect(await screen.findByTestId('editor-core-error')).toHaveTextContent('could not load')
  })
})
