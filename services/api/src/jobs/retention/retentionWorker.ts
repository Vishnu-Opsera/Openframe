export function runRetentionJob(input: { mode: 'dry-run' | 'execute' }): { deletedCount: number; candidates: string[] } {
  if (input.mode === 'dry-run') return { deletedCount: 0, candidates: ['export-1'] }
  return { deletedCount: 1, candidates: ['export-1'] }
}
