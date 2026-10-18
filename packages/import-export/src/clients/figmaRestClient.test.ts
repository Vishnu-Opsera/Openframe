import { describe, expect, it } from 'vitest'
import { fetchFigmaFile } from './figmaRestClient.ts'

describe('figma rest client', () => {
  it('sends the bearer token only through the resolver', async () => {
    let authorization = ''
    await fetchFigmaFile({ fileKey: 'abc', resolveCredential: () => 'secret://figma', fetchImpl: async (header) => { authorization = header; return { status: 200, body: '{}' } } })
    expect(authorization).toBe('Bearer secret://figma')
  })
})
