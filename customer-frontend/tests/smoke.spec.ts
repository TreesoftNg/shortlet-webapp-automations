import { expect, test } from '@playwright/test';
import { CustomerHomePage } from '../pages/home.page';
import { tags } from '../../shared/tags';

test.describe(`Customer smoke ${tags.smoke}`, () => {
  test('home loads with brand', async ({ page }) => {
    const home = new CustomerHomePage(page);
    await home.goto();
    // Full site or coming-soon both set a Sunmade document title.
    await expect(page).toHaveTitle(/Sunmade/i, { timeout: 30_000 });
    await expect(home.brand().or(page.getByLabel(/Sunmade/i).first())).toBeVisible({
      timeout: 10_000,
    });
  });
});
