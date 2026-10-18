export function generateSwiftUIArtifact(): Record<string, string> { return { 'Sources/SemanticCardView.swift': 'struct SemanticCardView {}', 'Sources/CanvasTokens.swift': 'enum CanvasTokens {}', 'Assets/asset-manifest.json': '{}', 'export-manifest.json': '{"artifactType":"swiftui"}' } }
export function mapTokensToSwiftUITheme(): string { return 'Color' }
