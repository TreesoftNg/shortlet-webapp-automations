import { expect, test } from './base';

test('owner opens reports, changes period, sees export actions', async ({ page }) => {

  await page.goto('/reports');
  await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole('radio', { name: '7D' }).click();
  await page.getByRole('radio', { name: '30D' }).click();

  await expect(page.getByRole('button', { name: /Export units/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Export properties/i })).toBeVisible();
});
