import { expect, test } from '@playwright/test';
import { loginAdmin, signOutAdmin } from '../shared/auth';
import { tags } from '../shared/tags';

/**
 * Admin console (shortlet-admin).
 * Add new journeys in this file as you grow the suite.
 */
test.describe(`Admin ${tags.smoke}`, () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('unauthenticated bookings redirects to login', async ({ page }) => {
    await page.goto('/bookings');
    await page.waitForURL(/\/login/);
    expect(page.url()).toMatch(/next=/);
  });
});

test.describe(`Admin ${tags.critical}`, () => {
  test('owner signs in, opens bookings, signs out', async ({ page }) => {
    await loginAdmin(page);
    await expect(page.getByText(/Owner|Sign out/i).first()).toBeVisible({
      timeout: 20_000,
    });

    await page.goto('/bookings');
    await expect(page.getByRole('heading', { name: /Bookings/i })).toBeVisible({
      timeout: 20_000,
    });

    await signOutAdmin(page);
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });
});
