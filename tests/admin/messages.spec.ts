import { expect, test } from './base';

test('owner opens messages and a conversation composer', async ({ page }) => {

  await page.goto('/messages');
  await expect(page.getByRole('heading', { name: /Messages/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^All/i })).toBeVisible();

  const thread = page
    .locator('main button, main a, main [role="button"]')
    .filter({ hasText: /@|\d{1,2}\s+\w{3}/i })
    .first();
  if (await thread.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await thread.click();
  }

  await expect(page.getByRole('button', { name: /^Send$/i })).toBeVisible({ timeout: 15_000 });
});
