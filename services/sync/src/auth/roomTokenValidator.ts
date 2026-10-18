export interface RoomClaims {
  fileId: string
  actorId: string
  permissions: string[]
  exp: number
  iat: number
  roomId: string
}

export function encodeRoomToken(claims: RoomClaims): string {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url')
  return `eyJhbGciOiJub25lIn0.${payload}.placeholder`
}

export function validateRoomToken(token: string, pathFileId: string, nowSeconds = Math.floor(Date.now() / 1000)): { ok: true; claims: RoomClaims } | { ok: false; closeCode: 4401 | 4403 } {
  const parts = token.split('.')
  if (parts.length !== 3 || parts[2] !== 'placeholder' || !parts[1]) {
    return { ok: false, closeCode: 4401 }
  }
  const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as RoomClaims
  if (claims.exp <= nowSeconds || claims.fileId !== pathFileId) {
    return { ok: false, closeCode: 4401 }
  }
  if (!claims.permissions.includes('edit') && !claims.permissions.includes('comment')) {
    return { ok: false, closeCode: 4403 }
  }
  return { ok: true, claims }
}
