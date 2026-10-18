export function generateHtmlCssArtifact(): Record<string, string> { return { 'index.html': '<main></main>', 'styles.css': ':root{}', 'assets/asset-manifest.json': '{}', 'export-manifest.json': '{"artifactType":"html-css"}' } }
export function mapTokensToCssCustomProperties(): string { return '--color-primary' }
