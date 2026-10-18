import { describe, expect, it } from 'vitest'
import { runFigmaImportJob } from './figmaImportJob.ts'

const input = { fileKey: 'file', credentialRef: 'secret://figma', requestedBy: 'user', workspaceId: 'workspace', destinationFileId: 'dest' }

describe('figma import job', () => {
  it('maps unauthorized and rate limit without logging authorization', async () => {
    const denied = await runFigmaImportJob(input, async () => ({ status: 401, body: '{}' }))
    const limited = await runFigmaImportJob(input, async () => ({ status: 429, body: '{}' }))
    expect(denied.log.failureCode).toBe('FIGMA_UNAUTHORIZED')
    expect(limited.log.failureCode).toBe('FIGMA_RATE_LIMITED')
    expect(JSON.stringify(denied.log)).not.toContain('Authorization')
    expect(JSON.stringify(denied.log)).not.toContain('secret://')
  })
})
