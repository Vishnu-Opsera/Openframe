import { useState } from 'react'
import recentFilesFixture from '../../tests/fixtures/dashboard/recent-files.json'
import workspacesFixture from '../../tests/fixtures/dashboard/workspaces.json'
import { FileActions } from './components/FileActions'
import { SyncStatusBadge } from './components/SyncStatusBadge'
import { WorkspaceSwitcher, type DashboardWorkspace } from './components/WorkspaceSwitcher'
import type { SyncStatus } from './syncStatus'

export type RecentFile = {
  id: string
  name: string
}

export function WorkspaceDashboard({
  workspaces = workspacesFixture.workspaces,
  recentFiles = recentFilesFixture.files,
  syncStatus = 'offline',
  selectedWorkspaceId,
}: {
  workspaces?: DashboardWorkspace[]
  recentFiles?: RecentFile[]
  syncStatus?: SyncStatus
  selectedWorkspaceId?: string
}) {
  const fallbackId = workspaces[0]?.id ?? ''
  const initialId =
    selectedWorkspaceId && workspaces.some((workspace) => workspace.id === selectedWorkspaceId)
      ? selectedWorkspaceId
      : fallbackId
  const [selectedId, setSelectedId] = useState(initialId)

  return (
    <section className="file-strip" aria-label="Workspace dashboard" data-testid="workspace-dashboard">
      <WorkspaceSwitcher workspaces={workspaces} selectedId={selectedId} onSelect={setSelectedId} />
      <FileActions />
      <SyncStatusBadge status={syncStatus} />
      {recentFiles.length === 0 ? (
        <p data-testid="recent-files-empty">No recent files</p>
      ) : (
        <ul data-testid="recent-files">
          {recentFiles.map((file) => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
