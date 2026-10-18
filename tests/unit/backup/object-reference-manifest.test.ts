import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createObjectReferenceManifest } from '../../../infrastructure/backup/object-reference-manifest.ts'
describe('object manifest', () => { it('preserves checksums', () => { const rows = JSON.parse(readFileSync('tests/fixtures/backup/file-version-rows.json', 'utf8')) as Array<{ checksum: string; file_id: string; version_id: string; object_key: string; created_at: string }>; const manifest = createObjectReferenceManifest(rows); expect(manifest.file_versions).toHaveLength(2); expect(manifest.file_versions[0]?.checksum).toBe('a') }) })
