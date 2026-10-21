# Shortlet webapp automations

Playwright E2E for Sunmade:

| Folder | What it is |
|--------|------------|
| `tests/customer/` | Guest site tests. Each file contains its own steps. |
| `tests/admin/` | Admin console tests. Each file contains its own steps. |

See [PLAN.md](./PLAN.md) for the full flow backlog.

## Setup

```bash
npm install
npm run install:browsers
cp .env.example .env
```

Fill `ADMIN_EMAIL` / `ADMIN_PASSWORD` and verified guest credentials in `.env`, then:

```bash
npm test                         # every test
npm run test:customer            # guest site
npm run test:admin               # admin console (all pages)
npm run test:admin:full          # one continuous admin tour (dashboard → sign out)
npm run test:admin:smoke         # admin login + key page loads
npm run test:booking             # reserve a stay and pay (Paystack)
npx playwright test tests/customer/home.spec.ts
npx playwright test tests/admin/bookings.spec.ts
```

## Env

| Variable | Purpose |
|----------|---------|
| `CUSTOMER_BASE_URL` | Guest site. Live: `https://shortlet-frontend-eta.vercel.app` |
| `ADMIN_BASE_URL` | Admin. Live: `https://shortlet-admin-lyart.vercel.app` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Owner account for admin specs |
| `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD` | Verified guest for sign-in, booking, and Paystack pay. Signup itself stops at the email code |

Never commit `.env`.

## Admin coverage

One file per area under `tests/admin/`: login, dashboard, bookings, availability, properties (including E2E create/archive), units, facilities, calendar sync, customers, messages, reviews, payments, reports, staff (including invite), settings, account.

Authenticated admin specs share one signed-in browser context per worker via [`tests/admin/base.ts`](tests/admin/base.ts) (the admin app rotates refresh tokens, so a saved storageState cannot be reused across new contexts).

## CI

`.github/workflows/e2e.yml` — set `CUSTOMER_BASE_URL`, `ADMIN_BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CUSTOMER_EMAIL`, and `CUSTOMER_PASSWORD` as repo secrets.

- Smoke: customer home/checkout + admin login/dashboard/properties (browse only)/payments/settings
- Critical (main / manual): customer signup/sign-in + admin bookings, customers, staff, availability, properties (includes create/archive)

Guest pay file `tests/customer/booking.spec.ts` is not part of CI. Run it with `npm run test:booking`.
