import { expect, test } from './base';

test('owner opens calendar sync filters and sync control', async ({ page }) => {

  await page.goto('/calendar-sync');
  await expect(page.getByRole('heading', { name: /Calendar sync/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^All/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Connected\d*$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Sync all connected/i })).toBeVisible();

  await page.getByRole('button', { name: /^Needs attention/i }).click();
  await page.getByRole('button', { name: /^All/i }).click();
});
