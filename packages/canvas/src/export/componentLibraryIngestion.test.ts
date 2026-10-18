import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ingestComponentLibrary } from './componentLibraryIngestion.ts'
describe('ingestion', () => { it('rejects unsafe snippets', () => { const fixture = JSON.parse(readFileSync('packages/canvas/test/fixtures/component-libraries/unsafe-script-snippet.json', 'utf8')) as { unsafe: boolean }; expect(ingestComponentLibrary(fixture).code).toBe('UNSAFE_COMPONENT_LIBRARY_INPUT') }) })
