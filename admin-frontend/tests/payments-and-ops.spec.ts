import { expect, test } from '@playwright/test';
import { loginAdmin } from '../../shared/auth';
import { tags } from '../../shared/tags';
import { AdminBookingsPage } from '../pages/bookings.page';

test.describe(`Admin payments and booking ops ${tags.critical} ${tags.slow}`, () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test('payments page loads', async ({ page }) => {
    await page.goto('/payments');
    await expect(
      page.getByRole('heading', { name: /Payments/i }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('bookings detail opens from first row when present', async ({
    page,
  }) => {
    const bookings = new AdminBookingsPage(page);
    await bookings.goto();
    await expect(bookings.heading()).toBeVisible();

    const row = bookings.firstRow();
    const hasRow = await row.isVisible().catch(() => false);
    test.skip(!hasRow, 'No booking rows in this environment');

    await row.click();
    await expect(
      page.getByText(/Check in|Cancel|Guest|Deposit|Status/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('customers page loads', async ({ page }) => {
    await page.goto('/customers');
    await expect(
      page.getByRole('heading', { name: /Customers/i }),
    ).toBeVisible({ timeout: 20_000 });
  });
});
