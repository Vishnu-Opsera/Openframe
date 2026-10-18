import packageJson from '../../package.json'
import cacheManifest from '../../tests/fixtures/pwa/cache-manifest.json'

const blockedFragments = ['/documents/', '/credentials/', '.canvas']

export function getPwaCacheName(): string {
  return `openframe-shell-${packageJson.version}`
}

export function getPwaCacheAllowList(): readonly string[] {
  return cacheManifest.assets.filter((asset) => !blockedFragments.some((fragment) => asset.includes(fragment)))
}
