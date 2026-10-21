import { expect, test } from './base';

test('owner opens dashboard and switches overview metrics', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('radio', { name: '30D' })).toBeVisible();

  await page.getByRole('radio', { name: '7D' }).click();
  await expect(page.getByRole('radio', { name: '7D' })).toBeChecked();

  await page.getByRole('radio', { name: 'Occupancy' }).click();
  await expect(page.getByRole('radio', { name: 'Occupancy' })).toBeChecked();

  await page.getByRole('radio', { name: 'Bookings' }).click();
  await expect(page.getByRole('radio', { name: 'Bookings' })).toBeChecked();

  await page.getByRole('radio', { name: 'Revenue' }).click();
  await expect(page.getByRole('radio', { name: 'Revenue' })).toBeChecked();
});
