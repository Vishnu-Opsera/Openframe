const actions = [
  { id: 'file-action-create', label: 'Create' },
  { id: 'file-action-open', label: 'Open' },
  { id: 'file-action-import', label: 'Import' },
] as const

export function FileActions() {
  return (
    <div className="file-actions">
      {actions.map((action) => (
        <button key={action.id} type="button" data-testid={action.id} disabled aria-label={action.label}>
          {action.label}
        </button>
      ))}
      <p className="file-note">File persistence is not available yet.</p>
    </div>
  )
}
