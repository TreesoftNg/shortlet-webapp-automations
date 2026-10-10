import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const customerBaseURL =
  process.env.CUSTOMER_BASE_URL ?? 'http://localhost:3000';
const adminBaseURL = process.env.ADMIN_BASE_URL ?? 'http://localhost:3001';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'customer',
      testDir: './customer-frontend',
      testMatch: /customer\.spec\.ts/,
      use: { baseURL: customerBaseURL },
    },
    {
      name: 'admin',
      testDir: './admin-frontend',
      testMatch: /admin\.spec\.ts/,
      use: { baseURL: adminBaseURL },
    },
  ],
});
