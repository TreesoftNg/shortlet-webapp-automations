import { expect, test } from './base';

test('owner opens reviews filters', async ({ page }) => {

  await page.goto('/reviews');
  await expect(page.getByRole('heading', { name: 'Reviews', exact: true })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^All/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Pending/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Published/i })).toBeVisible();

  await page.getByRole('button', { name: /Pending/i }).click();
  await page.getByRole('button', { name: /^All/i }).click();
});
