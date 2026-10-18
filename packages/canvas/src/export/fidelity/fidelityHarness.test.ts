import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { compareRenderedArtifacts } from './fidelityHarness.ts'
describe('fidelity harness', () => { it('passes the card fixture', () => { const fixture = JSON.parse(readFileSync('packages/canvas/test/fixtures/fidelity/react-tailwind-card/pass-case.json', 'utf8')) as { pass: boolean }; expect(compareRenderedArtifacts(fixture).diffPercent).toBeLessThan(1) }) })
