import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('helm values', () => {
  it('sets resources for every service', () => {
    const values = readFileSync('deploy/helm/canvas/values.yaml', 'utf8')
    for (const name of ['apiGateway', 'crdtSync', 'aiProviderRouter', 'postgres', 'redis', 'objectStorage']) expect(values).toContain(name)
    expect(readFileSync('deploy/helm/canvas/Chart.yaml', 'utf8')).toContain('name: canvas')
    expect(readFileSync('deploy/helm/canvas/templates/secrets.yaml', 'utf8')).not.toMatch(/sk-/)
  })
})
