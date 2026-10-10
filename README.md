# Shortlet webapp automations

Playwright end-to-end tests for:

- **customer-frontend** → [shortlet-frontend](../shortlet-frontend) (guest site)
- **admin-frontend** → [shortlet-admin](../shortlet-admin) (command center)

See [PLAN.md](./PLAN.md) for flows, phases, and conventions.

## Setup

```bash
npm install
npm run install:browsers
cp .env.example .env
# edit .env with URLs and demo credentials
```

Start **Sunmade** apps (not another project on the same ports) against a seeded API:

```bash
# example — adjust ports to match .env
cd ../shortlet-frontend && npm run dev          # CUSTOMER_BASE_URL
cd ../shortlet-admin && npm run dev -- -p 3001  # ADMIN_BASE_URL
cd ../shortlet-api && npm run start:dev
```

Then:

```bash
npm test                 # all projects
npm run test:smoke       # @smoke only
npm run test:critical    # @critical
npm run test:customer
npm run test:admin
npm run test:ui          # Playwright UI mode
```

## Env

| Variable | Purpose |
|----------|---------|
| `CUSTOMER_BASE_URL` | Guest site origin |
| `ADMIN_BASE_URL` | Admin origin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Demo owner (default `demo.owner@example.com`) |
| `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD` | Optional guest login |
| `PROPERTY_SLUG` | Optional known listing for book/pay |
| `TENANT_SLUG` | Usually `sunmade` |

Never commit `.env`.

## Tags

- `@smoke` — pages load
- `@critical` — login, bookings, search → checkout, cross-app
- `@slow` — Flutterwave / destructive ops

## CI

GitHub Actions workflow `.github/workflows/e2e.yml` runs `@smoke` (and optionally `@critical`) against staging URLs from repository secrets.
