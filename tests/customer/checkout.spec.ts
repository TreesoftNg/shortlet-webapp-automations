import { expect, test } from '@playwright/test';

test('checkout without a stay shows guidance', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.goto('/checkout');
  await expect(
    page.getByText(/Browse|select a stay|No stay|missing/i).first(),
  ).toBeVisible({ timeout: 20_000 });
});
