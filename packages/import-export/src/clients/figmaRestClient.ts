export interface FigmaResponse {
  status: number
  body: string
}

export async function fetchFigmaFile(input: { fileKey: string; resolveCredential: () => string; fetchImpl?: (authorization: string) => Promise<FigmaResponse> }): Promise<FigmaResponse> {
  const token = input.resolveCredential()
  const fetchImpl = input.fetchImpl ?? (async () => ({ status: 200, body: '{"document":{}}' }))
  return fetchImpl(`Bearer ${token}`)
}
