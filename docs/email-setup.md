# Email Provider Setup (Resend)

Fatoora AI uses the Provider Adapter pattern for emails (`src/lib/providers/email`).

## Local Development
In development, the system defaults to the `MockEmailProvider`, which safely logs email payloads to the server console instead of sending them.

## Production Setup
For production, you must configure **Resend**.

1. Create a free account at [Resend](https://resend.com/).
2. Verify your domain (e.g., `fatoora.ai`).
3. Generate an API Key.
4. Add to your `.env` (or Vercel Environment Variables):
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_1234567890
```

If these keys are missing in production, the application will gracefully log a warning and disable email sending without crashing.
