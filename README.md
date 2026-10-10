# Shortlet webapp automations

Playwright E2E for Sunmade:

| Folder | App | Spec |
|--------|-----|------|
| `customer-frontend/` | guest site | `customer.spec.ts` |
| `admin-frontend/` | admin console | `admin.spec.ts` |
| `shared/` | env, login helper, tags | — |

See [PLAN.md](./PLAN.md) for the full flow backlog. Keep **one spec file per app** until you outgrow it.

## Setup

```bash
npm install
npm run install:browsers
cp .env.example .env
```

Start Sunmade apps on the ports in `.env`, then:

```bash
npm test                 # both apps
npm run test:smoke       # @smoke
npm run test:critical    # @critical
npm run test:customer
npm run test:admin
npm run test:ui
```

## Env

| Variable | Purpose |
|----------|---------|
| `CUSTOMER_BASE_URL` | Guest site |
| `ADMIN_BASE_URL` | Admin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Demo owner |

Never commit `.env`.

## CI

`.github/workflows/e2e.yml` — set `CUSTOMER_BASE_URL`, `ADMIN_BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` as repo secrets.
