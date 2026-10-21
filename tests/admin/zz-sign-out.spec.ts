import { expect, test } from './base';

// Runs last (filename sort) so earlier admin specs keep the shared signed-in session.
test('owner signs out', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Sign out/i }).click();
  await page.waitForURL(/\/login/);
  await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
});
