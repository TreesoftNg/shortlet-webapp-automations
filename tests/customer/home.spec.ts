import { expect, test } from '@playwright/test';

test('home loads with Sunmade branding', async ({ page }) => {
  await page.goto('/?preview=1');
  await expect(page).toHaveTitle(/Sunmade/i, { timeout: 30_000 });
  await expect(
    page.getByText(/Sunmade/i).or(page.getByLabel(/Sunmade/i)).first(),
  ).toBeVisible({ timeout: 10_000 });
});
