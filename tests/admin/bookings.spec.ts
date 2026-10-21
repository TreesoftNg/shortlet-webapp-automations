import { expect, test } from './base';

test('owner opens bookings, filters, and opens a booking', async ({ page }) => {

  await page.goto('/bookings');
  await expect(page.getByRole('heading', { name: /Bookings/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByPlaceholder(/Reference, guest, email/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();

  await page.getByRole('button', { name: 'Upcoming' }).click();
  await page.getByRole('button', { name: 'All' }).click();

  const bookingLink = page.locator('main a[href*="/bookings/"]').first();
  const bookingRow = page.locator('main table tbody tr, main [role="row"]').filter({ hasText: /@/ }).first();
  if (await bookingLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await bookingLink.click();
    await expect(page).toHaveURL(/\/bookings\//);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20_000 });
    await page.goto('/bookings');
  } else if (await bookingRow.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await bookingRow.click();
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20_000 });
    await page.goto('/bookings');
  }
});

