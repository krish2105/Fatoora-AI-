# Backup and Recovery

Fatoora AI relies heavily on its database.

## Soft Deletes
The Prisma Schema uses `deletedAt DateTime?` for all major financial records (`Invoice`, `Expense`, `Customer`). 
If a user accidentally deletes an invoice, it is only hidden from the UI. An administrator can recover it by setting `deletedAt = null` directly in the database.

## Database Backups
Because you are using a hosted PostgreSQL provider (like Neon, Supabase, or AWS RDS):
1. **Point-in-Time Recovery (PITR)**: Ensure your provider has PITR enabled. Neon offers this out-of-the-box, allowing you to restore the database to any exact second in the past 7 days.
2. **Logical Backups**: Run `pg_dump` daily and store the SQL artifacts in a secure, encrypted S3 bucket for disaster recovery.

## Storage Backups
Ensure versioning is enabled on your S3 bucket so that if an expense receipt is overwritten or deleted, previous versions can be restored via the AWS Console.
