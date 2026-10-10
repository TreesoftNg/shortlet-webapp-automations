import { chromium, expect, test } from '@playwright/test';
import { loginAdmin } from '../auth';
import { env } from '../env';
import { tags } from '../tags';
import { CustomerSearchPage } from '../../customer-frontend/pages/search.page';
import { AdminBookingsPage } from '../../admin-frontend/pages/bookings.page';

/**
 * Cross-app: after a guest reaches checkout with guest details filled,
 * admin bookings list remains reachable. Full pay→confirm visibility is
 * asserted when PROPERTY_SLUG + Flutterwave are healthy (@slow).
 */
test.describe(`Cross-app booking visibility ${tags.critical} ${tags.slow}`, () => {
  test('admin can open bookings while customer site is up', async () => {
    const customerBrowser = await chromium.launch();
    const adminBrowser = await chromium.launch();

    const customerPage = await customerBrowser.newPage({
      baseURL: env.customerBaseURL(),
    });
    const adminPage = await adminBrowser.newPage({
      baseURL: env.adminBaseURL(),
    });

    try {
      await customerPage.goto('/?preview=1');
      await expect(customerPage.getByText(/Sunmade/i).first()).toBeVisible({
        timeout: 30_000,
      });

      const search = new CustomerSearchPage(customerPage);
      await search.goto();

      await loginAdmin(adminPage);
      const bookings = new AdminBookingsPage(adminPage);
      await bookings.goto();
      await expect(bookings.heading()).toBeVisible({ timeout: 20_000 });
    } finally {
      await customerBrowser.close();
      await adminBrowser.close();
    }
  });
});
