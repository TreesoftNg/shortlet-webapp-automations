import { faker } from '@faker-js/faker';
import { expect, test } from './base';

/**
 * One continuous admin tour: dashboard → every feature → sign out.
 * Run alone with: npm run test:admin:full
 * Or click ▶ on this file in the Testing view.
 */
test('owner walks every admin feature then signs out', async ({ page }) => {
  test.setTimeout(600_000);

  // --- Dashboard ---
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('radio', { name: '30D' })).toBeVisible();
  await page.getByRole('radio', { name: '7D' }).click();
  await expect(page.getByRole('radio', { name: '7D' })).toBeChecked();
  await page.getByRole('radio', { name: 'Occupancy' }).click();
  await page.getByRole('radio', { name: 'Bookings' }).click();
  await page.getByRole('radio', { name: 'Revenue' }).click();
  await expect(page.getByRole('radio', { name: 'Revenue' })).toBeChecked();

  // --- Bookings ---
  await page.getByRole('link', { name: 'Bookings', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Bookings/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByPlaceholder(/Reference, guest, email/i)).toBeVisible();
  await page.getByRole('button', { name: 'Upcoming' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  const bookingLink = page.locator('main a[href*="/bookings/"]').first();
  if (await bookingLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await bookingLink.click();
    await expect(page).toHaveURL(/\/bookings\//);
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole('link', { name: 'Bookings', exact: true }).click();
  }

  // --- Availability ---
  await page.getByRole('link', { name: 'Availability', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Availability/i })).toBeVisible({ timeout: 20_000 });
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

  // --- Properties (browse + create/archive) ---
  await page.getByRole('link', { name: 'Properties', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Properties/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: /^Listed/i })).toBeVisible();
  await page.getByRole('link', { name: /Add property/i }).click();
  await expect(page).toHaveURL(/\/properties\/new/);
  await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
  await expect(page).toHaveURL(/\/properties/);

  const propertyName = `E2E ${faker.string.alphanumeric(8)}`;
  await page.getByRole('link', { name: /Add property/i }).click();
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
    await page.getByRole('link', { name: 'Properties', exact: true }).click();
    await page.getByText(propertyName).first().click();
  }
  const archive = page.getByRole('button', { name: /Archive|Unlist/i }).first();
  if (await archive.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await archive.click();
    const confirm = page.getByRole('button', { name: /Archive|Confirm|Yes|Unlist/i }).last();
    if (await confirm.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await confirm.click();
    }
  }

  // --- Units ---
  await page.getByRole('link', { name: 'Units', exact: true }).click();
  await expect(page.getByRole('heading', { name: /^Units$/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('link', { name: /Add unit/i }).click();
  await expect(page).toHaveURL(/\/units\/new/);
  await expect(page.getByLabel(/Base nightly rate/i)).toBeVisible();
  await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
  await expect(page).toHaveURL(/\/units/);

  // --- Facilities ---
  await page.getByRole('link', { name: 'Facilities', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Facilities/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('link', { name: /Add facility/i }).first().click();
  await expect(page).toHaveURL(/\/facilities\/new/);
  await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
  await expect(page).toHaveURL(/\/facilities/);

  // --- Calendar sync ---
  await page.getByRole('link', { name: 'Calendar sync', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Calendar sync/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: /Sync all connected/i })).toBeVisible();
  await page.getByRole('button', { name: /^Needs attention/i }).click();
  await page.getByRole('button', { name: /^All/i }).click();

  // --- Customers ---
  await page.getByRole('link', { name: 'Customers', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Customers/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: /With stays/i }).click();
  await page.getByRole('button', { name: /^All/i }).click();
  const customerLink = page.locator('main a[href*="/customers/"]').first();
  if (await customerLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await customerLink.click();
    await expect(page).toHaveURL(/\/customers\//);
    await page.getByRole('link', { name: 'Customers', exact: true }).click();
  }

  // --- Messages ---
  await page.getByRole('link', { name: 'Messages', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Messages/i })).toBeVisible({ timeout: 20_000 });
  const thread = page
    .locator('main button, main a, main [role="button"]')
    .filter({ hasText: /@|\d{1,2}\s+\w{3}/i })
    .first();
  if (await thread.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await thread.click();
  }
  await expect(page.getByRole('button', { name: /^Send$/i })).toBeVisible({ timeout: 15_000 });

  // --- Reviews ---
  await page.getByRole('link', { name: 'Reviews', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Reviews', exact: true })).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole('button', { name: /Pending/i }).click();
  await page.getByRole('button', { name: /^All/i }).click();

  // --- Payments ---
  await page.getByRole('link', { name: 'Payments', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Payments/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Successful' }).click();
  await page.getByRole('button', { name: 'All' }).click();

  // --- Reports ---
  await page.getByRole('link', { name: 'Reports', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('radio', { name: '7D' }).click();
  await page.getByRole('radio', { name: '30D' }).click();
  await expect(page.getByRole('button', { name: /Export units/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Export properties/i })).toBeVisible();

  // --- Staff (modal + invite) ---
  await page.getByRole('link', { name: 'Staff', exact: true }).click();
  await expect(page.getByRole('heading', { name: /^Staff$/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('button', { name: /Invite member/i }).click();
  await expect(page.getByText(/Invite staff/i)).toBeVisible({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText(/Invite staff/i)).toBeHidden({ timeout: 10_000 });

  const inviteEmail = `e2e.${faker.string.alphanumeric(10).toLowerCase()}@mailinator.com`;
  await page.getByRole('button', { name: /Invite member/i }).click();
  await page.getByLabel(/First name/i).fill('E2E');
  await page.getByLabel(/Last name/i).fill(faker.person.lastName());
  await page.getByLabel(/^Email/i).fill(inviteEmail);
  await page.getByLabel(/^Role/i).selectOption({ label: 'Staff' });
  await page.getByRole('button', { name: /Send invite/i }).click();
  await expect(page.getByText(/Invite staff/i)).toBeHidden({ timeout: 20_000 });
  await page.getByRole('button', { name: /^Invited/i }).click();
  await expect(page.getByText(inviteEmail, { exact: true })).toBeVisible({ timeout: 20_000 });

  // --- Settings ---
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('tab', { name: 'Payments' }).click();
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await page.getByRole('tab', { name: 'Business' }).click();
  await expect(page.getByRole('button', { name: /Save changes|Save domains/i }).first()).toBeVisible();

  // --- Account ---
  await page.getByRole('link', { name: /Your account/i }).click();
  await expect(page.getByRole('heading', { name: /Your account/i })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: /Change password/i })).toBeVisible();

  // --- Sign out ---
  await page.getByRole('button', { name: /Sign out/i }).click();
  await page.waitForURL(/\/login/);
  await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
});
