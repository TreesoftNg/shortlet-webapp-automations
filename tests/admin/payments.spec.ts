import { expect, test } from './base';

test('owner opens payments and applies a status filter', async ({ page }) => {

  await page.goto('/payments');
  await expect(page.getByRole('heading', { name: /Payments/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Successful' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pending' })).toBeVisible();

  await page.getByRole('button', { name: 'Successful' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.locator('main')).toBeVisible();
});
