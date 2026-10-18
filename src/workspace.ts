import defaultWorkspace from '../tests/fixtures/app-shell/default-workspace.json'

export type WorkspaceFile = {
  id: string
  name: string
}

export type WorkspaceFixture = {
  workspaceName: string
  syncLabel: string
  files: WorkspaceFile[]
}

export type WorkspaceLoad =
  | { ok: true; workspace: WorkspaceFixture }
  | { ok: false; message: string }

function isFile(value: unknown): value is WorkspaceFile {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && typeof record.name === 'string'
}

export function parseWorkspace(value: unknown): WorkspaceLoad {
  if (typeof value !== 'object' || value === null) {
    return {
      ok: false,
      message: 'Workspace could not be loaded. The fixture is missing or malformed.',
    }
  }

  const record = value as Record<string, unknown>
  const files = record.files
  if (
    typeof record.workspaceName !== 'string' ||
    typeof record.syncLabel !== 'string' ||
    !Array.isArray(files) ||
    !files.every(isFile)
  ) {
    return {
      ok: false,
      message: 'Workspace could not be loaded. The fixture is missing or malformed.',
    }
  }

  return {
    ok: true,
    workspace: {
      workspaceName: record.workspaceName,
      syncLabel: record.syncLabel,
      files,
    },
  }
}

export function loadDefaultWorkspace(): WorkspaceLoad {
  return parseWorkspace(defaultWorkspace)
}
