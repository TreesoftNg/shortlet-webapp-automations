# Playwright E2E plan

## Goal

One place for browser E2E against guest (`shortlet-frontend`) and admin (`shortlet-admin`).

## Layout (keep it small)

```
shortlet-webapp-automations/
  PLAN.md
  README.md
  package.json
  playwright.config.ts
  .env.example
  shared/                 # env, auth, tags
  customer-frontend/
    customer.spec.ts      # all guest journeys
  admin-frontend/
    admin.spec.ts         # all admin journeys
```

Add page objects later only when a spec gets hard to read. Prefer growing the two spec files first.

## Tools

- `@playwright/test` + TypeScript
- `dotenv` + `.env` (gitignored)
- `@faker-js/faker` when you need fake guest data
- Flutterwave test cards for pay flows
- GitHub Actions for CI

## Environments

- `CUSTOMER_BASE_URL` / `ADMIN_BASE_URL`
- Demo owner: `demo.owner@example.com` (seeded password)
- Tenant slug `sunmade` on the apps

## Flow backlog (add to the two specs over time)

**Customer:** home → search → property → book/pay → confirmation; auth; trips; review; contact; coming soon.

**Admin:** login; bookings ops; payments; property/unit/media; availability; calendar sync; staff; customers; reviews; settings.

**Cross-app (later):** guest books → admin sees it; staff invite → accept → login.

## Tags

`@smoke` · `@critical` · `@slow`
