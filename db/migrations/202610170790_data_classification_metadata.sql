CREATE TABLE data_classification_metadata (
  entity_type text PRIMARY KEY,
  classification_tier text NOT NULL,
  retention_category text NOT NULL,
  redaction_policy text NOT NULL,
  exportable boolean NOT NULL,
  erasable boolean NOT NULL,
  owner_team text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
