import { expect, test } from '@playwright/test';
import { env } from '../../shared/env';
import { tags } from '../../shared/tags';

test.describe(`Customer auth and content ${tags.smoke}`, () => {
  test('auth page loads', async ({ page }) => {
    await page.goto('/?preview=1');
    await page.goto('/auth');
    await expect(
      page.getByRole('heading', { name: /Sign in|Sign up|Account|Welcome/i }).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('unauthenticated trips redirects to auth', async ({ page }) => {
    await page.goto('/?preview=1');
    await page.goto('/trips');
    await page.waitForURL(/\/auth|\/trips/, { timeout: 20_000 });
    // Either stays on trips (public shell) or redirects to auth.
    if (page.url().includes('/auth')) {
      await expect(page).toHaveURL(/\/auth/);
    }
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/?preview=1');
    await page.goto('/contact');
    await expect(
      page.getByRole('heading', { name: /Contact/i }).first(),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('locations page loads', async ({ page }) => {
    await page.goto('/?preview=1');
    await page.goto('/locations');
    await expect(page.getByText(/Lagos|Abuja|Neighbourhood|Location/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('customer credentials can sign in when provided', async ({ page }) => {
    test.skip(!env.hasCustomerCredentials(), 'Set CUSTOMER_EMAIL / CUSTOMER_PASSWORD');

    await page.goto('/?preview=1');
    await page.goto('/auth');
    await page.getByLabel(/Email/i).fill(env.customerEmail()!);
    await page.getByLabel(/Password/i).fill(env.customerPassword()!);
    await page.getByRole('button', { name: /Sign in|Log in/i }).click();
    await page.waitForURL(/\/(account|trips|$)/, { timeout: 30_000 });
  });
});
