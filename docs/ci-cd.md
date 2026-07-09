# Fatoora AI: CI/CD Pipeline

Fatoora AI uses **GitHub Actions** for Continuous Integration.

## Workflow Overview
The `.github/workflows/ci.yml` file defines our CI pipeline. It runs on every `push` and `pull_request` to the `main` branch.

### What it checks:
1. **Dependency Installation**: Ensures `package-lock.json` is healthy.
2. **Prisma Generation**: Ensures the database schema is valid.
3. **Typechecking**: Runs `tsc --noEmit` to catch any TypeScript errors.
4. **ESLint**: Runs `npm run lint` to enforce code quality.
5. **Unit Tests**: Runs `npm run test:run` (Vitest) to verify business logic (e.g. VAT calculations, permissions).
6. **Next.js Build**: Runs a production build to ensure there are no compilation or Server Component errors.

### Troubleshooting Build Failures
- **Typecheck Failures**: Usually caused by implicitly `any` types. Run `npm run typecheck` locally to debug.
- **Prisma Failures**: If the schema is invalid, run `npm run db:validate`.
- **Environment Failures**: The CI pipeline injects mock `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `DATABASE_URL` values solely to satisfy Zod validation during the build phase. Do not remove these from the `ci.yml`.
