# Playwright E2E automations plan

## Goal

This repo is the single place for browser E2E tests against the guest site (`shortlet-frontend`) and admin (`shortlet-admin`), driven by Playwright.

## Repo layout

```
shortlet-webapp-automations/
  PLAN.md
  README.md
  package.json
  playwright.config.ts
  .env.example
  .gitignore
  shared/
  customer-frontend/
    tests/
    pages/
  admin-frontend/
    tests/
    pages/
```

One root Playwright install, two projects (different `baseURL` + `testDir`). Shared helpers live in `shared/`.

## Tools

- Runner: `@playwright/test` (TypeScript)
- Env: `dotenv` + gitignored `.env` (commit `.env.example`)
- Fake data: `@faker-js/faker`
- Reports: Playwright HTML + trace on failure
- CI: GitHub Actions
- Payments: Flutterwave test cards + hosted checkout (assert redirect/confirm)
- OTP/invite mail (later): Mailosaur or similar

No Cypress, Cucumber, or Allure for v1.

## Environments

- Customer: `CUSTOMER_BASE_URL` (e.g. `http://localhost:3000`)
- Admin: `ADMIN_BASE_URL` (e.g. `http://localhost:3001`)
- Apps point at API (`localhost:4000` or staging) with tenant slug `sunmade`
- Prefer demo owner `demo.owner@example.com` (seeded password) over personal accounts

## Flows — customer-frontend

1. Home to search
2. Search to property detail
3. Locations to filtered search
4. Book and pay (critical): property, checkout, Flutterwave test pay, confirmation
5. Checkout empty / bad dates
6. Sign up + OTP (when inbox ready)
7. Sign in / out / auth guards
8. Trips (auth)
9. Leave review on past trip
10. Contact form
11. Coming soon / preview cookie if `COMING_SOON` is on

## Flows — admin-frontend

1. Owner login + sign out
2. Auth redirect with `next=`
3. Bookings list / tabs / detail
4. Check-in / cancel (disposable booking)
5. Release deposit / refund stay
6. Payments list + verify with Flutterwave
7. Create property + unit
8. Unit gallery upload / cover / video link
9. Availability block + remove
10. Calendar sync import / export smoke
11. Staff invite + resend (owner)
12. Customers, reviews publish/hide, settings save

## Cross-app

1. Guest books and pays, admin sees confirmed booking
2. Staff payment-link booking, guest pays, admin shows paid
3. Owner invites staff, invitee accepts and logs in

## Phases

| Phase | Focus |
|-------|--------|
| 0 | Scaffold + smoke |
| 1 | Critical path (login, bookings, search → checkout) |
| 2 | Money and ops + first cross-app flow |
| 3 | Inventory, calendar, staff, customers, reviews, settings |
| 4 | CI against staging |

## Conventions

- Page objects under each app `pages/`
- Specs named by journey (`book-and-pay.spec.ts`)
- Prefer `getByRole` / labels
- Tags `@smoke`, `@critical`, `@slow`
- Never commit real passwords
