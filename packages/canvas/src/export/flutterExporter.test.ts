import { describe, expect, it } from 'vitest'
import { generateFlutterArtifact, mapTokensToFlutterTheme } from './flutterExporter.ts'
describe('flutter', () => { it('emits dart', () => { expect(Object.keys(generateFlutterArtifact())).toContain('lib/semantic_card.dart'); expect(mapTokensToFlutterTheme()).toBe('ThemeData') }) })
