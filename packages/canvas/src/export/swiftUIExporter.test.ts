import { describe, expect, it } from 'vitest'
import { generateSwiftUIArtifact, mapTokensToSwiftUITheme } from './swiftUIExporter.ts'
describe('swiftui', () => { it('emits sources', () => { expect(Object.keys(generateSwiftUIArtifact())).toContain('Sources/SemanticCardView.swift'); expect(mapTokensToSwiftUITheme()).toBe('Color') }) })
