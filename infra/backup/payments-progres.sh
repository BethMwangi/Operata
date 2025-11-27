#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/payments-platform"
mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

echo "[backup] Starting PostgreSQL backups at $TIMESTAMP"

docker exec auth-db pg_dump -U auth_user auth_db > \
  "$BACKUP_DIR/auth_db-$TIMESTAMP.sql"

docker exec payment-db pg_dump -U payment_user payment_db > \
  "$BACKUP_DIR/payment_db-$TIMESTAMP.sql"

echo "[backup] Cleaning up backups older than 7 days"
find "$BACKUP_DIR" -type f -name "*.sql" -mtime +7 -delete

echo "[backup] Done"



# to maeke it executable use thsi below commands

# chmod +x infra/backup/payments-postgres.sh
# sudo cp infra/backup/payments-postgres.sh /usr/local/bin/payments-postgres.sh