import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const customerBaseURL =
  process.env.CUSTOMER_BASE_URL ?? 'https://shortlet-frontend-eta.vercel.app';
const adminBaseURL =
  process.env.ADMIN_BASE_URL ?? 'https://shortlet-admin-lyart.vercel.app';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    // Video/screenshots per test force new browser contexts and look jumpy when watching.
    // Keep them in CI; locally prefer one steady Chrome window.
    trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'customer',
      testDir: './tests/customer',
      use: { baseURL: customerBaseURL },
    },
    {
      name: 'admin',
      testDir: './tests/admin',
      testIgnore: [/auth\.setup\.ts/, /base\.ts/, /login\.spec\.ts/],
      fullyParallel: false,
      workers: 1,
      use: { baseURL: adminBaseURL },
    },
    {
      name: 'admin-login',
      testDir: './tests/admin',
      testMatch: /login\.spec\.ts/,
      use: { baseURL: adminBaseURL },
    },
  ],
});
