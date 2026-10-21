import { expect, test } from './base';

test('owner opens availability and booking tools without saving', async ({ page }) => {

  await page.goto('/availability');
  await expect(page.getByRole('heading', { name: /Availability/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: 'Today', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Week', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Month', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await page.getByRole('button', { name: 'Month', exact: true }).click();

  await page.getByRole('button', { name: 'Block dates' }).click();
  await expect(
    page.getByRole('dialog').or(page.getByRole('heading', { name: /Block/i })).first(),
  ).toBeVisible({ timeout: 10_000 });
  const cancelBlock = page.getByRole('button', { name: /Cancel|Close|Back/i }).first();
  if (await cancelBlock.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await cancelBlock.click();
  } else {
    await page.keyboard.press('Escape');
  }

  await page.getByRole('button', { name: 'New booking' }).click();
  await expect(
    page.getByRole('dialog').or(page.getByRole('heading', { name: /booking/i })).first(),
  ).toBeVisible({ timeout: 10_000 });
  const cancelBooking = page.getByRole('button', { name: /Cancel|Close|Back/i }).first();
  if (await cancelBooking.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await cancelBooking.click();
  } else {
    await page.keyboard.press('Escape');
  }
});
