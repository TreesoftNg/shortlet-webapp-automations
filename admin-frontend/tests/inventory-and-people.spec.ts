import { expect, test } from '@playwright/test';
import { loginAdmin } from '../../shared/auth';
import { tags } from '../../shared/tags';
import { AdminStaffPage } from '../pages/staff.page';

test.describe(`Admin inventory and people ${tags.smoke}`, () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('properties page loads', async ({ page }) => {
    await page.goto('/properties');
    await expect(
      page.getByRole('heading', { name: /Properties/i }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('units page loads', async ({ page }) => {
    await page.goto('/units');
    await expect(page.getByRole('heading', { name: /Units/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test('availability page loads', async ({ page }) => {
    await page.goto('/availability');
    await expect(
      page.getByRole('heading', { name: /Availability/i }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('calendar sync page loads', async ({ page }) => {
    await page.goto('/calendar-sync');
    await expect(
      page.getByRole('heading', { name: /Calendar/i }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('staff page loads and invite is available for owner', async ({
    page,
  }) => {
    const staff = new AdminStaffPage(page);
    await staff.goto();
    await expect(staff.heading()).toBeVisible({ timeout: 20_000 });
    await expect(staff.inviteButton()).toBeEnabled();
  });

  test('reviews page loads', async ({ page }) => {
    await page.goto('/reviews');
    await expect(page.getByRole('heading', { name: /Reviews/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible({
      timeout: 20_000,
    });
  });
});
