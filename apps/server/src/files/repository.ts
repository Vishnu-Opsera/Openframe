export interface DesignFileRow {
  id: string
  workspace_id: string
  name: string
  schema_version: string
  created_by_user_id: string
  created_at: string
  updated_at: string
  permission: 'edit' | 'comment' | 'view'
  deleted: boolean
}

export function insertDesignFile(statement: string, params: readonly string[], rows: DesignFileRow[]): DesignFileRow {
  if (!statement.includes('$1') || !statement.includes('$2') || statement.includes('${')) {
    throw new Error('file insert must be parameterized')
  }
  const created: DesignFileRow = {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    workspace_id: params[0] ?? '',
    name: params[1] ?? '',
    schema_version: params[2] ?? '1',
    created_by_user_id: params[3] ?? '',
    created_at: '2026-10-17T00:00:00Z',
    updated_at: '2026-10-17T00:00:00Z',
    permission: 'edit',
    deleted: false,
  }
  rows.push(created)
  return created
}

export function findDesignFile(statement: string, params: readonly string[], rows: DesignFileRow[]): DesignFileRow | undefined {
  if (!statement.includes('$1') || statement.includes('${')) {
    throw new Error('file lookup must be parameterized')
  }
  const fileId = params[0] ?? ''
  return rows.find((row) => row.id === fileId && !row.deleted)
}
