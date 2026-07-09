# Testing Strategy

Fatoora AI uses **Vitest** for fast, reliable unit testing.

## Running Tests
```bash
npm run test:run  # Run once
npm run test      # Run in watch mode
```

## What We Test
We do not test React component rendering, as the UI is meant to be highly flexible. Instead, we test the core **Financial and Security Logic**:

1. **Calculations (`tests/calculations.test.ts`)**
   - We test that `Decimal.js` accurately calculates 5% VAT.
   - We test Zero-Rated and Exempt line items.
   - We test that rounding errors do not occur.

2. **Permissions & Security (`tests/permissions.test.ts`)**
   - We test Role-Based Access Control (RBAC).
   - We ensure Viewers cannot execute mutations.
   - We ensure Owners have full access.
   - We verify `requireOrganization` throws securely when needed.

## CI/CD Integration
Tests run automatically on every push via `.github/workflows/ci.yml`. The build will fail if calculations or permissions are broken.
