INSERT INTO "USERS" (id, email, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'ada@openframe.dev', '2026-03-15T00:00:00Z', '2026-03-15T00:00:00Z');
INSERT INTO "WORKSPACES" (id, name, owner_user_id, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222222', 'Northwind', '11111111-1111-1111-1111-111111111111', '2026-03-15T00:00:00Z', '2026-03-15T00:00:00Z');
INSERT INTO "DESIGN_FILES" (id, workspace_id, name, object_key, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Cover', 'objects/cover', '2026-03-15T00:00:00Z', '2026-03-15T00:00:00Z');
INSERT INTO "FILE_PERMISSIONS" (id, design_file_id, actor_user_id, allow_open, allow_edit, allow_comment, allow_export, allow_plugin, allow_provider, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', false, false, false, false, false, false, '2026-03-15T00:00:00Z', '2026-03-15T00:00:00Z'),
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', true, true, true, true, true, true, '2026-03-15T00:00:00Z', '2026-03-15T00:00:00Z');
INSERT INTO "AUDIT_EVENTS" (id, actor_user_id, resource_type, resource_id, operation, outcome, request_id, occurred_at) VALUES
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'DESIGN_FILES', '33333333-3333-3333-3333-333333333333', 'open', 'allow', 'req-1', '2026-03-15T00:00:00Z');
