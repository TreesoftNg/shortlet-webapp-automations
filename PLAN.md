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
  tests/
    customer/             # one spec per guest journey, steps live in the file
    admin/                # one spec per admin journey, steps live in the file
```

To run one journey, pass the file: `npx playwright test tests/customer/home.spec.ts`.

## Tools

- `@playwright/test` + TypeScript
- `dotenv` + `.env` (gitignored)
- `@faker-js/faker` when you need fake guest / E2E admin data
- Paystack test checkout for guest pay flows
- GitHub Actions for CI

## Environments

- `CUSTOMER_BASE_URL` — live guest: `https://shortlet-frontend-eta.vercel.app`
- `ADMIN_BASE_URL` — live admin: `https://shortlet-admin-lyart.vercel.app`
- Admin specs use `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
- Tenant slug `sunmade` on the apps

## Flow backlog

**Customer:** home → search → property → book/pay (Paystack) → confirmation; auth; trips; review; contact; coming soon.

**Admin (covered):** login; dashboard; bookings; availability; properties (+ create/archive); units; facilities; calendar sync; customers; messages; reviews; payments; reports; staff (+ invite); settings; account.

**Cross-app (later):** guest books → admin sees it; staff invite → accept → login.
