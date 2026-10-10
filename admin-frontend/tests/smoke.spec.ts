import { expect, test } from '@playwright/test';
import { AdminLoginPage } from '../pages/login.page';
import { tags } from '../../shared/tags';

test.describe(`Admin smoke ${tags.smoke}`, () => {
  test('login page loads', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await expect(login.heading()).toBeVisible({ timeout: 30_000 });
    await expect(login.email()).toBeVisible();
    await expect(login.password()).toBeVisible();
    await expect(login.submit()).toBeVisible();
  });
});
