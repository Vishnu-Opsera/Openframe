export const USERS = 'USERS'
export const WORKSPACES = 'WORKSPACES'
export const DESIGN_FILES = 'DESIGN_FILES'
export const FILE_PERMISSIONS = 'FILE_PERMISSIONS'
export const AUDIT_EVENTS = 'AUDIT_EVENTS'

export interface UserRow {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceRow {
  id: string
  name: string
  ownerUserId: string | null
  createdAt: string
  updatedAt: string
}

export interface DesignFileRow {
  id: string
  workspaceId: string
  name: string
  objectKey: string | null
  createdAt: string
  updatedAt: string
}

export interface FilePermissionRow {
  id: string
  designFileId: string
  actorUserId: string
  allowOpen: boolean
  allowEdit: boolean
  allowComment: boolean
  allowExport: boolean
  allowPlugin: boolean
  allowProvider: boolean
}

export interface AuditEventRow {
  id: string
  actorUserId: string | null
  resourceType: string
  resourceId: string
  operation: string
  outcome: string
  requestId: string
  occurredAt: string
}

export const PERMISSION_ACTIONS = ['open', 'edit', 'comment', 'export', 'plugin', 'provider'] as const

export function permissionAllowed(row: FilePermissionRow | undefined, action: (typeof PERMISSION_ACTIONS)[number]): boolean {
  if (!row) {
    return false
  }
  const flags = {
    open: row.allowOpen,
    edit: row.allowEdit,
    comment: row.allowComment,
    export: row.allowExport,
    plugin: row.allowPlugin,
    provider: row.allowProvider,
  }
  return flags[action]
}
