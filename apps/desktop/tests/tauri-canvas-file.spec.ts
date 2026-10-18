import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function invoke(command: string, args: { path: string }) {
  if (command !== 'open_canvas_file') {
    throw new Error(`unknown command ${command}`)
  }
  const document = JSON.parse(readFileSync(args.path, 'utf8')) as { schema_version: number }
  return { document, schema_version: document.schema_version, path: args.path }
}

describe('tauri-canvas-file', () => {
  it('opens a version 1 canvas fixture', () => {
    const opened = invoke('open_canvas_file', { path: 'tests/fixtures/canvas/v1/valid_minimal.canvas.json' })
    expect(opened.schema_version).toBe(1)
    expect(opened.document.schema_version).toBe(1)
  })
})
