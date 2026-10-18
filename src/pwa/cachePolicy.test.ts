import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json'
import { getPwaCacheAllowList, getPwaCacheName } from './cachePolicy'

describe('getPwaCacheName', () => {
  it('includes the package version and excludes workspace or file identifiers', () => {
    const name = getPwaCacheName()
    expect(name).toBe(`openframe-shell-${packageJson.version}`)
    expect(name).not.toMatch(/workspace|file-/i)
  })
})

describe('getPwaCacheAllowList', () => {
  it('keeps the app shell assets and drops document or credential paths', () => {
    const assets = getPwaCacheAllowList()
    expect(assets).toContain('/')
    expect(assets).toContain('/manifest.webmanifest')
    expect(assets.some((asset) => asset.includes('.canvas') || asset.includes('/credentials/'))).toBe(false)
  })
})
