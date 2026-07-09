# Storage Provider Setup (AWS S3)

Fatoora AI uses the Provider Adapter pattern for file storage (`src/lib/providers/storage`).
This is primarily used for uploading Expense receipts and downloading Invoice PDFs.

## Local Development
In development, the system defaults to the `MockStorageProvider`, which simulates signed URLs and returns dummy links to prevent cluttering your local filesystem or requiring S3 buckets.

## Production Setup
For production, you can use AWS S3 or any S3-compatible provider (Cloudflare R2, DigitalOcean Spaces, Supabase Storage).

1. Create an S3 Bucket. Make sure it is **Private** (Block Public Access).
2. Create an IAM User with `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` permissions for that bucket.
3. Add to your `.env` (or Vercel):
```env
STORAGE_PROVIDER=s3
S3_BUCKET=fatoora-ai-receipts
S3_REGION=eu-central-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=wJalr...
```

If the keys are missing, file uploads will be gracefully disabled.
