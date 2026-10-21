import { faker } from '@faker-js/faker';
import { expect, test } from './base';

test('owner opens units and add-unit form', async ({ page }) => {
  await page.goto('/units');
  await expect(page.getByRole('heading', { name: /^Units$/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^Active/i })).toBeVisible();

  await page.getByRole('link', { name: /Add unit/i }).click();
  await expect(page).toHaveURL(/\/units\/new/);
  await expect(page.getByRole('heading', { name: /Add unit/i })).toBeVisible();
  await expect(page.getByLabel(/^Property/i)).toBeVisible();
  await expect(page.getByLabel(/^Name/i)).toBeVisible();
  await expect(page.getByLabel(/Base nightly rate/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Create unit/i }).first()).toBeVisible();

  await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
  await expect(page).toHaveURL(/\/units/);
});

test('owner creates a unit from the full add-unit form', async ({ page }) => {
  test.setTimeout(120_000);

  const code = `E${faker.string.alphanumeric(5).toUpperCase()}`;
  const unitName = `E2E Unit ${faker.string.alphanumeric(6)}`;

  await page.goto('/units');
  await page.getByRole('link', { name: /Add unit/i }).click();
  await expect(page.getByRole('heading', { name: /Add unit/i })).toBeVisible({
    timeout: 20_000,
  });

  const property = page.getByLabel(/^Property/i);
  await expect(property).toBeVisible();
  // Prefer a real property option (skip empty placeholder if present).
  const propertyValue = await property.inputValue().catch(() => '');
  if (!propertyValue) {
    const options = property.locator('option');
    const count = await options.count();
    const index = count > 1 ? 1 : 0;
    await property.selectOption({ index });
  }
  await expect(property).not.toHaveValue('');

  await page.getByLabel(/^Status/i).selectOption({ label: 'Active' });
  await page.getByLabel(/^Code/i).fill(code);
  await page.getByLabel(/^Name/i).fill(unitName);
  await page.getByLabel(/Floor \/ location/i).fill('E2E floor');
  await page.getByLabel(/Short summary/i).fill('E2E automated unit');

  await page.getByLabel(/Max guests/i).fill('2');
  await page.getByLabel(/^Bedrooms/i).fill('1');
  await page.getByLabel(/^Beds/i).fill('1');
  await page.getByLabel(/^Bathrooms/i).fill('1');

  const wifiRow = page.getByText(/Wi-?Fi/i).first();
  if (await wifiRow.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await wifiRow.click();
  }

  await page.getByLabel(/Internal notes/i).fill('Created by Playwright E2E');
  await page.getByLabel(/Base nightly rate/i).fill('75000');
  await page.getByLabel(/Cleaning fee/i).fill('5000');
  await page.getByLabel(/Weekly discount/i).fill('10');
  await page.getByLabel(/Monthly discount/i).fill('20');
  await page.getByLabel(/Minimum nights/i).fill('1');
  await page.getByLabel(/Maximum nights/i).fill('14');

  await page.getByRole('button', { name: /Create unit/i }).first().click();

  // Create succeeds by opening the new unit (gallery tab).
  await expect(page).toHaveURL(/\/units\/(?!new)/, { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: /Edit unit/i })).toBeVisible({
    timeout: 20_000,
  });

  await page.getByRole('link', { name: 'Units', exact: true }).click();
  await expect(page.getByRole('heading', { name: /^Units$/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(unitName).first()).toBeVisible({ timeout: 20_000 });
});
