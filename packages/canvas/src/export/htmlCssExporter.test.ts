import { describe, expect, it } from 'vitest'
import { generateHtmlCssArtifact, mapTokensToCssCustomProperties } from './htmlCssExporter.ts'
describe('html css', () => { it('emits html', () => { expect(Object.keys(generateHtmlCssArtifact())).toContain('index.html'); expect(mapTokensToCssCustomProperties()).toContain('--color') }) })
