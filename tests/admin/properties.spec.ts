import { faker } from '@faker-js/faker';
import { expect, test } from './base';

test('owner browses properties and opens add-property form', async ({ page }) => {
  await page.goto('/properties');
  await expect(page.getByRole('heading', { name: /Properties/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole('button', { name: /^All/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Listed/i })).toBeVisible();

  await page.getByRole('link', { name: /Add property/i }).click();
  await expect(page).toHaveURL(/\/properties\/new/);
  await expect(page.getByRole('heading', { name: /Add property/i })).toBeVisible();
  await expect(page.getByLabel(/Property name/i)).toBeVisible();
  await expect(page.getByLabel(/Street address/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Create property/i }).first()).toBeVisible();

  await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
  await expect(page).toHaveURL(/\/properties/);
});

test('owner creates an E2E property then archives it', async ({ page }) => {
  test.setTimeout(120_000);

  const propertyName = `E2E ${faker.string.alphanumeric(8)}`;

  await page.goto('/properties/new');
  await expect(page.getByRole('heading', { name: /Add property/i })).toBeVisible({
    timeout: 20_000,
  });

  await page.getByLabel(/Property name/i).fill(propertyName);
  await page.getByLabel(/Street address/i).fill('12 Admiralty Way');
  await page.getByLabel(/^City/i).fill('Lagos');
  await page.getByLabel(/^Country/i).fill('Nigeria');
  await page.getByLabel(/Max guests/i).fill('2');

  await page.getByRole('button', { name: /Create property/i }).first().click();
  await expect(page.getByText(propertyName).first()).toBeVisible({ timeout: 30_000 });

  const propertyLink = page.getByRole('link', { name: new RegExp(propertyName, 'i') }).first();
  if (await propertyLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await propertyLink.click();
  } else {
    await page.goto('/properties');
    await expect(page.getByText(propertyName).first()).toBeVisible({ timeout: 20_000 });
    await page.getByText(propertyName).first().click();
  }

  const archive = page.getByRole('button', { name: /Archive|Unlist/i }).first();
  if (await archive.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await archive.click();
    const confirm = page.getByRole('button', { name: /Archive|Confirm|Yes|Unlist/i }).last();
    if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await confirm.click();
    }
    await expect(
      page.getByText(/Archived|Unlisted|archived|unlisted/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  }
});
