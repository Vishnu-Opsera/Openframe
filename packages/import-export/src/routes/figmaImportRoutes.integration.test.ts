import { describe, expect, it } from 'vitest'
import { getFigmaImportJob, runFigmaImportJob } from '../jobs/figmaImportJob.ts'

describe('figma import routes', () => {
  it('queues a job and reports success', async () => {
    const queued = await runFigmaImportJob({ fileKey: 'abc', credentialRef: 'secret://figma', requestedBy: 'user', workspaceId: 'workspace', destinationFileId: 'dest' }, async () => ({ status: 200, body: '{"name":"frame"}' }))
    expect(queued.status).toBe(202)
    expect(getFigmaImportJob(queued.jobId)?.status).toBe('succeeded')
  })
})
