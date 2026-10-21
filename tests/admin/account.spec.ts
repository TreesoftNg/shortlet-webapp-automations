import { expect, test } from './base';

test('owner opens account page with change password', async ({ page }) => {

  await page.goto('/account');
  await expect(page.getByRole('heading', { name: /Your account/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /Change password/i })).toBeVisible();
});
