import { checkFilePermission, type FilePermissionRow } from '../auth/filePermissions.ts'
import { forbidden, toErrorResponse } from '../gateway/errors.ts'

export function issueRoomToken(input: { actorUserId: string; designFileId: string; rows: FilePermissionRow[] }) {
  const decision = checkFilePermission({ actorUserId: input.actorUserId, designFileId: input.designFileId, action: 'open', rows: input.rows })
  if (!decision.allowed) {
    const error = toErrorResponse(forbidden('Open permission is required', 'req-room'), 'req-room')
    return { status: error.statusCode, body: error.body }
  }
  return { status: 200, body: { room_token: 'room-token', design_file_id: input.designFileId } }
}
