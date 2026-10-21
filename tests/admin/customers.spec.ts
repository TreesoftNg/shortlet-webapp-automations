import { expect, test } from './base';

test('owner opens customers and a customer profile when available', async ({ page }) => {

  await page.goto('/customers');
  await expect(page.getByRole('heading', { name: /Customers/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^All/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /With stays/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^New/i })).toBeVisible();

  await page.getByRole('button', { name: /With stays/i }).click();
  await page.getByRole('button', { name: /^All/i }).click();

  const customerLink = page.locator('main a[href*="/customers/"]').first();
  if (await customerLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await customerLink.click();
    await expect(page).toHaveURL(/\/customers\//);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20_000 });
  }
});
