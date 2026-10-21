import { expect, test } from '@playwright/test';

test('verified guest signs in', async ({ page }) => {
  const email = process.env.CUSTOMER_EMAIL?.trim() ?? '';
  const password = process.env.CUSTOMER_PASSWORD?.trim() ?? '';
  test.skip(
    email === '' || password === '',
    'Set CUSTOMER_EMAIL and CUSTOMER_PASSWORD in .env to a guest that has already verified their email.',
  );

  await page.goto('/auth');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue' }).click();

  const signedIn = page.waitForURL(/\/account(?:\/|$|\?)/, { timeout: 30_000 }).then(() => true);
  const rejected = page
    .getByRole('alert')
    .filter({ hasText: /\S/ })
    .first()
    .waitFor({ state: 'visible', timeout: 30_000 })
    .then(() => false);
  const ok = await Promise.race([signedIn, rejected]);
  if (!ok) {
    const message = (
      await page.getByRole('alert').filter({ hasText: /\S/ }).first().innerText()
    ).trim();
    throw new Error(`Guest sign-in failed: ${message}`);
  }

  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByRole('heading', { name: 'Your account' })).toBeVisible();
  await expect(page.getByText('Manage your profile and review your trips.')).toBeVisible();
  await expect(page.getByText(/verify your email/i)).toHaveCount(0);
});
