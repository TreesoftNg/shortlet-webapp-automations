import { expect, test } from '@playwright/test';
import { loginAdmin, signOutAdmin } from '../../shared/auth';
import { tags } from '../../shared/tags';
import { AdminBookingsPage } from '../pages/bookings.page';

test.describe(`Admin login and bookings ${tags.critical}`, () => {
  test('owner signs in, opens bookings, signs out', async ({ page }) => {
    await loginAdmin(page);
    await expect(page.getByText(/Owner|Sign out/i).first()).toBeVisible({
      timeout: 20_000,
    });

    const bookings = new AdminBookingsPage(page);
    await bookings.goto();
    await expect(bookings.heading()).toBeVisible({ timeout: 20_000 });

    await signOutAdmin(page);
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });

  test('unauthenticated bookings redirects to login with next', async ({
    page,
  }) => {
    await page.goto('/bookings');
    await page.waitForURL(/\/login/);
    expect(page.url()).toMatch(/next=/);
  });
});
