import { createHash, randomBytes } from 'node:crypto'

export function generatePkceChallenge(): { verifier: string; challenge: string; state: string } {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge, state: randomBytes(16).toString('base64url') }
}

export function validateOidcCallback(expectedState: string, actualState: string): boolean {
  return expectedState.length > 0 && expectedState === actualState
}
