import { faker } from '@faker-js/faker';
import { expect, test } from './base';

test('owner opens staff and invite modal', async ({ page }) => {
  await page.goto('/staff');
  await expect(page.getByRole('heading', { name: /^Staff$/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^Active/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Invited/i })).toBeVisible();

  await page.getByRole('button', { name: /Invite member/i }).click();
  await expect(page.getByText(/Invite staff/i)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByLabel(/First name/i)).toBeVisible();
  await expect(page.getByLabel(/Last name/i)).toBeVisible();
  await expect(page.getByLabel(/^Email/i)).toBeVisible();
  await expect(page.getByLabel(/^Role/i)).toBeVisible();

  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText(/Invite staff/i)).toBeHidden({ timeout: 10_000 });
});

test('owner invites an E2E staff member', async ({ page }) => {
  test.setTimeout(90_000);

  const inviteEmail = `e2e.${faker.string.alphanumeric(10).toLowerCase()}@mailinator.com`;
  const firstName = 'E2E';
  const lastName = faker.person.lastName();

  await page.goto('/staff');
  await page.getByRole('button', { name: /Invite member/i }).click();
  await expect(page.getByText(/Invite staff/i)).toBeVisible({ timeout: 10_000 });

  await page.getByLabel(/First name/i).fill(firstName);
  await page.getByLabel(/Last name/i).fill(lastName);
  await page.getByLabel(/^Email/i).fill(inviteEmail);
  await page.getByLabel(/^Role/i).selectOption({ label: 'Staff' });
  await page.getByRole('button', { name: /Send invite/i }).click();

  await expect(page.getByText(/Invite staff/i)).toBeHidden({ timeout: 20_000 });
  await page.getByRole('button', { name: /^Invited/i }).click();
  await expect(page.getByText(inviteEmail, { exact: true })).toBeVisible({ timeout: 20_000 });
});
