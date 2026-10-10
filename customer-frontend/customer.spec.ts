import { expect, test } from '@playwright/test';
import { tags } from '../shared/tags';

/**
 * Guest site (shortlet-frontend).
 * Add new journeys in this file as you grow the suite.
 */
test.describe(`Customer ${tags.smoke}`, () => {
  test('home loads with Sunmade branding', async ({ page }) => {
    await page.goto('/?preview=1');
    await expect(page).toHaveTitle(/Sunmade/i, { timeout: 30_000 });
    await expect(
      page.getByText(/Sunmade/i).or(page.getByLabel(/Sunmade/i)).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('checkout without a stay shows guidance', async ({ page }) => {
    await page.goto('/?preview=1');
    await page.goto('/checkout');
    await expect(
      page.getByText(/Browse|select a stay|No stay|missing/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
