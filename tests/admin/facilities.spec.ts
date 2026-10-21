import { faker } from '@faker-js/faker';
import { expect, test } from './base';

test('owner opens facilities and add-facility form', async ({ page }) => {
  await page.goto('/facilities');
  await expect(page.getByRole('heading', { name: /Facilities/i })).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole('link', { name: /Add facility/i }).first().click();
  await expect(page).toHaveURL(/\/facilities\/new/);
  await expect(page.getByRole('heading', { name: /Add facility/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByLabel(/^Name/i)).toBeVisible();
  await expect(page.getByLabel(/Category/i)).toBeVisible();

  await page.getByRole('button', { name: /Back/i }).first().click();
  await expect(page).toHaveURL(/\/facilities/);
});

test('owner adds facilities, edits one, then deletes one', async ({ page }) => {
  test.setTimeout(180_000);

  const facilityA = `E2E ${faker.string.alphanumeric(6)} Pool`;
  const facilityB = `E2E ${faker.string.alphanumeric(6)} Gym`;
  const facilityAEdited = `${facilityA} Updated`;
  const category = 'E2E Essentials';

  await page.goto('/facilities');
  await expect(page.getByRole('heading', { name: /Facilities/i })).toBeVisible({
    timeout: 20_000,
  });

  // --- Add first facility ---
  await page.getByRole('link', { name: /Add facility/i }).first().click();
  await expect(page.getByRole('heading', { name: /Add facility/i })).toBeVisible({
    timeout: 20_000,
  });
  await page.getByLabel(/^Name/i).fill(facilityA);
  await page.getByLabel(/Category/i).fill(category);
  await page.getByRole('button', { name: /^Add facility$/i }).click();
  await expect(page.getByRole('heading', { name: /^Facilities$/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByText(facilityA).first()).toBeVisible({ timeout: 20_000 });

  // --- Add second facility ---
  await page.getByRole('link', { name: /Add facility/i }).first().click();
  await page.getByLabel(/^Name/i).fill(facilityB);
  await page.getByLabel(/Category/i).fill(category);
  await page.getByRole('button', { name: /^Add facility$/i }).click();
  await expect(page.getByText(facilityB).first()).toBeVisible({ timeout: 20_000 });

  // --- Edit first facility ---
  const rowA = page.locator('main tr, main [role="row"]').filter({ hasText: facilityA }).first();
  await expect(rowA).toBeVisible({ timeout: 15_000 });
  await rowA.getByRole('button', { name: 'Edit' }).click();
  await expect(page).toHaveURL(/\/facilities\/.+\/edit/);
  await expect(page.getByRole('heading', { name: /Edit facility/i })).toBeVisible({
    timeout: 20_000,
  });
  await page.getByLabel(/^Name/i).fill(facilityAEdited);
  await page.getByLabel(/Category/i).fill(`${category} Plus`);
  await page.getByRole('button', { name: /Save changes/i }).click();
  await expect(page.getByRole('heading', { name: /^Facilities$/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByText(facilityAEdited).first()).toBeVisible({ timeout: 20_000 });

  // --- Delete second facility ---
  const rowB = page.locator('main tr, main [role="row"]').filter({ hasText: facilityB }).first();
  await expect(rowB).toBeVisible({ timeout: 15_000 });
  await rowB.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(/Delete facility/i)).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(page.getByText(/Delete facility/i)).toBeHidden({ timeout: 15_000 });
  await page.getByRole('button', { name: /^Active/i }).click();
  await expect(rowB).toHaveCount(0, { timeout: 15_000 });

  await page.getByRole('button', { name: /^Deleted/i }).click();
  await expect(page.getByText(facilityB).first()).toBeVisible({ timeout: 20_000 });
});
