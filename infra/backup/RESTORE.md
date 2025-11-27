# Restore Procedure

1. Stop application traffic (optional in dev):
   - Scale services down or stop nginx if needed.

2. Identify the backup file to restore, e.g.:
   - `/var/backups/payments-platform/auth_db-20251126-020001.sql`
   - `/var/backups/payments-platform/payment_db-20251126-020001.sql`

3. Restore Auth DB:

```bash
cat /var/backups/payments-platform/auth_db-20251126-020001.sql \
  | docker exec -i auth-db psql -U auth_user -d auth_db
```

4. Restore Payment DB:
```bash 
cat /var/backups/payments-platform/payment_db-20251126-020001.sql \
  | docker exec -i payment-db psql -U payment_user -d payment_db
```

Once Done you can restart the services with below commnads

``` bash 
docker compose up -d auth-service-1 auth-service-2 payment-service-1 payment-service-2
```