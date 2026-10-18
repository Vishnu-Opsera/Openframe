export type DashboardWorkspace = {
  id: string
  name: string
}

export function WorkspaceSwitcher({
  workspaces,
  selectedId,
  onSelect,
}: {
  workspaces: DashboardWorkspace[]
  selectedId: string
  onSelect: (workspaceId: string) => void
}) {
  const selected = workspaces.find((workspace) => workspace.id === selectedId) ?? workspaces[0]

  return (
    <label>
      Workspace
      <select
        data-testid="workspace-switcher"
        aria-label="Workspace"
        value={selected?.id ?? ''}
        onChange={(event) => onSelect(event.target.value)}
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
      <span data-testid="workspace-name">{selected?.name ?? 'No workspace'}</span>
    </label>
  )
}
