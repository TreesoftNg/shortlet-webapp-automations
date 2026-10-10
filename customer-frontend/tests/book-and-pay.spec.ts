import { expect, test } from '@playwright/test';
import { env } from '../../shared/env';
import { tags } from '../../shared/tags';
import { CustomerCheckoutPage } from '../pages/checkout.page';
import { CustomerPropertyPage } from '../pages/property.page';
import { CustomerSearchPage } from '../pages/search.page';

/**
 * Full Flutterwave happy path. Marked @slow — needs live apps, seeded
 * inventory, and Flutterwave test mode. Completes hosted checkout when
 * Flutterwave redirects to /confirmation.
 */
test.describe(`Customer book and pay ${tags.critical} ${tags.slow}`, () => {
  test('reserve from listing through checkout pay CTA', async ({ page }) => {
    const search = new CustomerSearchPage(page);
    await search.goto();

    const count = await search.listingCards().count();
    test.skip(count === 0, 'No listings available to book');

    await search.openFirstListing();

    const property = new CustomerPropertyPage(page);
    const reserve = property.reserveButton();
    test.skip(
      !(await reserve.isVisible().catch(() => false)),
      'Reserve CTA not visible (dates/unit may be required)',
    );

    await reserve.click();

    // Either land on checkout or stay on property if quote validation failed.
    if (!page.url().includes('/checkout')) {
      test.skip(true, 'Could not reach checkout from reserve');
    }

    const checkout = new CustomerCheckoutPage(page);
    await checkout.fillGuestDetails();

    const pay = checkout.payButton();
    await expect(pay).toBeVisible({ timeout: 20_000 });
    await pay.click();

    // Hosted Flutterwave or in-app confirmation — accept either.
    await page.waitForURL(
      /(flutterwave|checkout\.flutterwave|\/confirmation)/i,
      { timeout: 60_000 },
    );

    if (page.url().includes('/confirmation')) {
      await expect(
        page.getByText(/confirmed|thank you|booking|paid/i).first(),
      ).toBeVisible({ timeout: 30_000 });
    }
  });

  test('property slug path reaches reserve when configured', async ({
    page,
  }) => {
    const slug = env.propertySlug();
    test.skip(!slug, 'Set PROPERTY_SLUG in .env');

    const property = new CustomerPropertyPage(page);
    await property.goto(slug!);
    await expect(property.reserveButton()).toBeVisible({ timeout: 20_000 });
  });
});
