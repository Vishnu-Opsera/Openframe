#!/bin/sh
set -eu
test -n "${DATABASE_URL:-}" && test -n "${BACKUP_DESTINATION_URL:-}"
echo "pg_dump custom"
