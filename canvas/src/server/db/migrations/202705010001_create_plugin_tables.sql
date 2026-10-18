CREATE TABLE plugin_packages (workspace_id text, plugin_id text, created_at timestamptz, status text);
CREATE TABLE plugin_capability_grants (workspace_id text, plugin_id text, created_at timestamptz, status text);
CREATE TABLE plugin_installation_events (workspace_id text, plugin_id text, created_at timestamptz, status text);
