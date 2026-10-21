import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test('guest creates an account and is asked to verify email', async ({ page }) => {
  // The guest API rejects example.com. Mailinator accepts the verification send.
  const email = `e2e.${faker.string.alphanumeric(10).toLowerCase()}@mailinator.com`;
  const password = `Sunmade!${faker.string.alphanumeric({ length: 6, casing: 'lower' })}`;

  await page.goto('/auth');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill(faker.person.firstName());
  await page.getByRole('textbox', { name: 'Last name' }).fill(faker.person.lastName());
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText(/verification code|code we sent/i).first()).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
});
