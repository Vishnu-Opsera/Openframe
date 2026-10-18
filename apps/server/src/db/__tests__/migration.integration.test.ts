// @vitest-environment node
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
import { describe, expect, it } from 'vitest'

describe('core metadata migration', () => {
  it('creates the hosted metadata tables on a clean database', async () => {
    const sql = readFileSync('apps/server/src/db/migrations/0001_core_metadata.sql', 'utf8')
    const database = new PGlite()
    await database.exec(sql)
    const tables = await database.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public'",
    )
    const names = tables.rows.map((row) => row.table_name)
    for (const table of ['USERS', 'WORKSPACES', 'DESIGN_FILES', 'FILE_PERMISSIONS', 'AUDIT_EVENTS']) {
      expect(names).toContain(table)
    }
    const indexes = await database.query<{ indexname: string }>('select indexname from pg_indexes')
    expect(indexes.rows.map((row) => row.indexname)).toContain('audit_events_actor_time_idx')
  })
})
