import { expect, test } from '@playwright/test';

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('unauthenticated bookings redirects to login', async ({ page }) => {
  await page.goto('/bookings');
  await page.waitForURL(/\/login/);
  expect(page.url()).toMatch(/next=/);
});
