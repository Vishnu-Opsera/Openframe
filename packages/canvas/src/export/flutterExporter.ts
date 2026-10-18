export function generateFlutterArtifact(): Record<string, string> { return { 'lib/semantic_card.dart': 'class SemanticCard {}', 'lib/canvas_tokens.dart': 'class CanvasTokens {}', 'pubspec.yaml': 'name: canvas', 'assets/asset_manifest.json': '{}', 'export-manifest.json': '{"artifactType":"flutter"}' } }
export function mapTokensToFlutterTheme(): string { return 'ThemeData' }
