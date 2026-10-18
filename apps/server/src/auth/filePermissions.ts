export const filePermissionActions = ['open', 'edit', 'comment', 'export', 'plugin', 'provider'] as const

export type FilePermissionAction = (typeof filePermissionActions)[number]

export interface FilePermissionRow {
  actorUserId: string
  designFileId: string
  action: FilePermissionAction
  allow: boolean
}

export function checkFilePermission(input: { actorUserId: string; designFileId: string; action: string; rows: FilePermissionRow[] }): { allowed: boolean; status: number; code: string } {
  if (!filePermissionActions.includes(input.action as FilePermissionAction)) {
    return { allowed: false, status: 400, code: 'invalid_action' }
  }
  const action = input.action as FilePermissionAction
  const row = input.rows.find((item) => item.actorUserId === input.actorUserId && item.designFileId === input.designFileId && item.action === action)
  if (!row || !row.allow) {
    return { allowed: false, status: 403, code: 'forbidden' }
  }
  return { allowed: true, status: 200, code: 'allowed' }
}
