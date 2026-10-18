import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { handleImportValidation } from './importValidation.ts'

function bytes(name: string): Uint8Array {
  return new Uint8Array(readFileSync(`packages/import-export/fixtures/unsafe/${name}`))
}

describe('import validation route', () => {
  it('rejects unsafe payloads and sanitizes onload svg', () => {
    expect(handleImportValidation(bytes('svg-script.svg'), 'image/svg+xml').body.findings).toContain('UNSAFE_SVG_SCRIPT')
    expect(handleImportValidation(bytes('svg-xxe.svg'), 'image/svg+xml').body.findings).toContain('XML_EXTERNAL_ENTITY_BLOCKED')
    expect(handleImportValidation(bytes('svg-onload.svg'), 'image/svg+xml').status).toBe(200)
    expect(handleImportValidation(bytes('pdf-malformed.pdf'), 'application/pdf').status).toBe(400)
    const log = handleImportValidation(bytes('fig-suspicious.json'), 'application/json').log
    expect(JSON.stringify(log)).not.toContain('rawPayload')
    expect(JSON.stringify(log)).not.toContain('authorization')
  })
})
