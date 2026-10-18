import { fetchFigmaFile } from '../clients/figmaRestClient.ts'
import { validateImportPayload } from '../security/inputValidator.ts'

export interface FigmaImportJobInput {
  fileKey: string
  credentialRef: string
  requestedBy: string
  workspaceId: string
  destinationFileId: string
}

const jobs = new Map<string, { status: string; importArtifactRef: string; failureCode: string }>()

export async function runFigmaImportJob(input: FigmaImportJobInput, fetchImpl: (authorization: string) => Promise<{ status: number; body: string }>): Promise<{ jobId: string; status: number; log: Record<string, string | number> }> {
  const response = await fetchFigmaFile({ fileKey: input.fileKey, resolveCredential: () => input.credentialRef, fetchImpl })
  const validation = validateImportPayload(new TextEncoder().encode(response.body), 'application/json')
  const failureCode = response.status === 401 ? 'FIGMA_UNAUTHORIZED' : response.status === 429 ? 'FIGMA_RATE_LIMITED' : validation.safeForSceneGraph ? '' : 'INVALID_IMPORT_PAYLOAD'
  const jobId = `figma-${jobs.size + 1}`
  jobs.set(jobId, { status: failureCode ? 'failed' : 'succeeded', importArtifactRef: `artifact://${jobId}`, failureCode })
  return {
    jobId,
    status: 202,
    log: { jobId, workspaceId: input.workspaceId, destinationFileId: input.destinationFileId, provider: 'figma', attempt: 1, durationMs: 1, status: failureCode ? 'failed' : 'succeeded', failureCode },
  }
}

export function getFigmaImportJob(jobId: string): { status: string; importArtifactRef: string; failureCode: string } | undefined {
  return jobs.get(jobId)
}
