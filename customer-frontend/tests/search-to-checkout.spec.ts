import { expect, test } from '@playwright/test';
import { env } from '../../shared/env';
import { tags } from '../../shared/tags';
import { CustomerCheckoutPage } from '../pages/checkout.page';
import { CustomerPropertyPage } from '../pages/property.page';
import { CustomerSearchPage } from '../pages/search.page';

test.describe(`Customer search to checkout ${tags.critical}`, () => {
  test('search shows listings and opens a property', async ({ page }) => {
    const search = new CustomerSearchPage(page);
    await search.goto();
    await expect(page).toHaveURL(/\/search/);

    const count = await search.listingCards().count();
    test.skip(count === 0, 'No listings in this environment');

    await search.openFirstListing();
    await expect(page).toHaveURL(/\/properties\//);
  });

  test('known property slug loads', async ({ page }) => {
    const slug = env.propertySlug();
    test.skip(!slug, 'Set PROPERTY_SLUG in .env');

    const property = new CustomerPropertyPage(page);
    await property.goto(slug!);
    await expect(page).toHaveURL(new RegExp(`/properties/${slug}`));
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('checkout without property shows empty guidance', async ({ page }) => {
    const checkout = new CustomerCheckoutPage(page);
    await checkout.gotoEmpty();
    await expect(checkout.emptyState()).toBeVisible({ timeout: 20_000 });
  });
});
