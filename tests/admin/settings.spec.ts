import { expect, test } from './base';

test('owner opens settings tabs without saving payment secrets', async ({ page }) => {

  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible({
    timeout: 20_000,
  });

  await expect(page.getByRole('tab', { name: 'Business' })).toBeVisible();
  await page.getByRole('tab', { name: 'Payments' }).click();
  await expect(page.getByRole('tab', { name: 'Payments' })).toBeVisible();

  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('tab', { name: 'Notifications' })).toBeVisible();

  await page.getByRole('tab', { name: 'Business' }).click();
  await expect(page.getByRole('button', { name: /Save changes|Save domains/i }).first()).toBeVisible();
});
