-- Rollback: DROP TABLE "AI_PROVIDER_CONFIGS";
-- Do not apply during a release freeze without an approved exception.
CREATE TABLE IF NOT EXISTS "AI_PROVIDER_CONFIGS" (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL,
  provider_key text NOT NULL,
  provider_kind text NOT NULL,
  display_name text NOT NULL,
  secret_ref text,
  endpoint_url text,
  model text,
  enabled boolean NOT NULL DEFAULT true,
  default_route_priority integer NOT NULL DEFAULT 100,
  retention_policy text NOT NULL,
  data_classification text NOT NULL,
  status text NOT NULL,
  last_validated_at timestamptz,
  validation_error_code text,
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS ai_provider_configs_workspace_idx ON "AI_PROVIDER_CONFIGS" (workspace_id, provider_key, enabled, default_route_priority);
