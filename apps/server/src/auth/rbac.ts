export interface FilePermission {
  actorUserId: string
  designFileId: string
  allowOpen: boolean
}

export function canAccessFile(permissions: FilePermission[], actorUserId: string, designFileId: string): boolean {
  return permissions.some((permission) => permission.actorUserId === actorUserId && permission.designFileId === designFileId && permission.allowOpen)
}
