import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('shipping pipeline', () => {
  it('names the build jobs', () => {
    const source = readFileSync('.forge/shipping.yml', 'utf8')
    for (const name of ['build:node', 'build:rust', 'build:docker', 'build:wasm-package', 'canvas-web', 'canvas-rust-core', 'canvas-sync-images', 'canvas-wasm']) expect(source).toContain(name)
    expect(readFileSync('tests/fixtures/ci/forge-release-tag-event.json', 'utf8')).toContain('v1.0.0-rc.1')
  })
})
