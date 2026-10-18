-- Openframe core metadata. Rollback: drop tables in reverse dependency order.
-- Release freeze: do not apply this migration during a block-off window without an approved exception.
CREATE TABLE IF NOT EXISTS "USERS" (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS "WORKSPACES" (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  owner_user_id uuid REFERENCES "USERS"(id),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS "DESIGN_FILES" (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES "WORKSPACES"(id),
  name text NOT NULL,
  object_key text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS "FILE_PERMISSIONS" (
  id uuid PRIMARY KEY,
  design_file_id uuid NOT NULL REFERENCES "DESIGN_FILES"(id),
  actor_user_id uuid NOT NULL REFERENCES "USERS"(id),
  allow_open boolean NOT NULL DEFAULT false,
  allow_edit boolean NOT NULL DEFAULT false,
  allow_comment boolean NOT NULL DEFAULT false,
  allow_export boolean NOT NULL DEFAULT false,
  allow_plugin boolean NOT NULL DEFAULT false,
  allow_provider boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS "AUDIT_EVENTS" (
  id uuid PRIMARY KEY,
  actor_user_id uuid,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  operation text NOT NULL,
  outcome text NOT NULL,
  request_id text NOT NULL,
  occurred_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS audit_events_actor_time_idx ON "AUDIT_EVENTS" (actor_user_id, occurred_at);
