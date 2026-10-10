import type { Page } from '@playwright/test';
import { env } from './env';

/** Sign in on the admin console (baseURL = ADMIN_BASE_URL). */
export async function loginAdmin(
  page: Page,
  credentials: { email?: string; password?: string } = {},
): Promise<void> {
  const email = credentials.email ?? env.adminEmail();
  const password = credentials.password ?? env.adminPassword();

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  const businessSelect = page.locator('select').filter({
    has: page.locator('option', { hasText: /business|sunmade/i }),
  });
  if (await businessSelect.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await businessSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Sign in' }).click();
  }

  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 30_000,
  });
}

export async function signOutAdmin(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Sign out/i }).click();
  await page.waitForURL(/\/login/);
}
