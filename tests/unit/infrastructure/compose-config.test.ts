import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
function parseComposeServices(source: string): string[] {
  const services = source.split(/^volumes:/m)[0] ?? source
  return [...services.matchAll(/^  ([a-z0-9-]+):/gm)].map((match) => match[1] ?? '')
}
describe('compose config', () => {
  it('names the required services and volumes', () => {
    const source = readFileSync('infrastructure/compose/docker-compose.yml', 'utf8')
    expect(parseComposeServices(source).sort()).toEqual(['ai-provider-router', 'api-gateway', 'crdt-sync', 'object-storage', 'postgres', 'redis'])
    expect(source).toContain('postgres-data')
    expect(source).toContain('redis-data')
  })
})
