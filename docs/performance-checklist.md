# Performance Checklist

To ensure Fatoora AI feels like a premium fintech application, follow these performance rules:

- [x] **Dynamic Imports**: The massive 3D Hero component (`@react-three/fiber`) is dynamically imported (`next/dynamic`) to avoid blocking the main thread on the landing page.
- [x] **Server Components**: The `/app` router is heavily leveraged to keep data fetching on the server.
- [x] **Database Indexes**: `organizationId`, `status`, and date fields are indexed in PostgreSQL.
- [x] **Image Optimization**: The `next/image` component is used for all static assets.
- [x] **Bundle Size**: We use `lucide-react` carefully. `Decimal.js` is kept server-side where possible.
- [x] **Pagination**: Large lists (Invoices, Expenses) should implement cursor or offset pagination (Currently implemented as take/skip limits).
