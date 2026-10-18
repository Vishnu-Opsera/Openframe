import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('helm smoke fixture', () => { it('uses a local host', () => { expect(readFileSync('deploy/helm/canvas/values.self-hosted.yaml', 'utf8')).toContain('canvas.local') }) })
