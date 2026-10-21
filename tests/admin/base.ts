import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

type WorkerFixtures = {
  adminPage: Page;
};

async function signIn(page: Page) {
  const email = process.env.ADMIN_EMAIL?.trim() ?? '';
  const password = process.env.ADMIN_PASSWORD?.trim() ?? '';
  if (email === '' || password === '') {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
  }

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.locator('input[type="password"]').fill(password);
  const signInButton = page.getByRole('button', { name: 'Sign in' });
  await expect(signInButton).toBeEnabled({ timeout: 10_000 });
  await signInButton.click();

  const businessSelect = page.locator('select').filter({
    has: page.locator('option', { hasText: /business|sunmade/i }),
  });
  if (await businessSelect.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await businessSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Sign in' }).click();
  }

  if (await page.getByText(/Too many attempts/i).isVisible().catch(() => false)) {
    throw new Error('Admin sign-in rate limited. Wait a minute and re-run the admin suite.');
  }

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 60_000 });
  await expect(page.getByRole('button', { name: /Sign out/i })).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * One Chrome tab for the whole admin worker: sign in once, keep the window open,
 * and only navigate between tests (no open/close flicker).
 */
export const test = base.extend<object, WorkerFixtures>({
  adminPage: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await signIn(page);
      await use(page);
      await context.close();
    },
    { scope: 'worker' },
  ],

  page: async ({ adminPage }, use) => {
    if (await adminPage.getByRole('heading', { name: /Sign in/i }).isVisible().catch(() => false)) {
      await signIn(adminPage);
    }
    await use(adminPage);
  },
});

export { expect };
