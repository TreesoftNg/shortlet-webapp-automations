import { expect, test } from '@playwright/test';

const checkIn = '2026-11-11';
const checkOut = '2026-11-13';

test.use({
  channel: 'chrome',
  headless: false,
  launchOptions: {
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
  },
});

test('guest reserves a stay and pays with Paystack', async ({ page }) => {
  const email = process.env.CUSTOMER_EMAIL?.trim() ?? '';
  const password = process.env.CUSTOMER_PASSWORD?.trim() ?? '';
  test.skip(
    email === '' || password === '',
    'Set CUSTOMER_EMAIL and CUSTOMER_PASSWORD in .env to a guest that has already verified their email.',
  );
  test.setTimeout(300_000);

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  await page.goto('/auth');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue' }).click();

  const reachedAccount = page.waitForURL(/\/account(?:\/|$|\?)/, { timeout: 30_000 }).then(() => true);
  const rejected = page
    .getByRole('alert')
    .filter({ hasText: /\S/ })
    .first()
    .waitFor({ state: 'visible', timeout: 30_000 })
    .then(() => false);
  if (!(await Promise.race([reachedAccount, rejected]))) {
    const message = (
      await page.getByRole('alert').filter({ hasText: /\S/ }).first().innerText()
    ).trim();
    throw new Error(`Guest sign-in failed: ${message}`);
  }

  const propertySlug = process.env.PROPERTY_SLUG?.trim();
  let propertyPaths: string[];
  if (propertySlug) {
    propertyPaths = [`/properties/${propertySlug}`];
  } else {
    await page.goto('/?preview=1');
    const stays = page.locator('a[href*="/properties/"]');
    await expect(stays.first()).toBeVisible({ timeout: 30_000 });
    propertyPaths = await stays.evaluateAll((links) => {
      const paths = links
        .map((link) => link.getAttribute('href') ?? '')
        .filter((href) => href.includes('/properties/'));
      return [...new Set(paths)];
    });
  }

  let openedCheckout = false;
  for (const propertyPath of propertyPaths) {
    await page.goto(propertyPath);
    await page.waitForURL(/\/properties\//);

    await expect(page.getByRole('button', { name: 'Reserve' }).filter({ visible: true }).first()).toBeVisible({
      timeout: 30_000,
    });

    const checkInInput = page.getByRole('textbox', { name: 'Check-in' }).filter({ visible: true }).first();
    const checkOutInput = page.getByRole('textbox', { name: 'Checkout' }).filter({ visible: true }).first();
    await expect(checkInInput).toBeVisible({ timeout: 30_000 });
    await checkInInput.fill(checkIn);
    await checkOutInput.fill(checkOut);
    await expect(checkInInput).toHaveValue(checkIn);
    await expect(checkOutInput).toHaveValue(checkOut);

    await page.getByRole('button', { name: 'Reserve' }).filter({ visible: true }).first().click();
    await page.waitForURL(/\/checkout/);
    await expect(page).toHaveURL(new RegExp(`checkIn=${checkIn}`));
    await expect(page).toHaveURL(new RegExp(`checkOut=${checkOut}`));

    const datesUnavailable = page.getByRole('heading', { name: 'Dates unavailable' });
    const signedInAs = page.getByText(/Signed in as/i);
    await expect(datesUnavailable.or(signedInAs)).toBeVisible({ timeout: 20_000 });
    if (await datesUnavailable.isVisible()) {
      continue;
    }

    openedCheckout = true;
    break;
  }

  if (!openedCheckout) {
    throw new Error(
      `Those dates are no longer free (${checkIn} to ${checkOut}). Change checkIn and checkOut at the top of this file.`,
    );
  }

  const guest = page.locator('input').filter({ visible: true });
  await guest.nth(0).fill('Ada');
  await guest.nth(1).fill('Emeka');
  await expect(guest.nth(2)).toHaveValue(email);
  await guest.nth(3).fill('08067567890');

  await page.getByRole('button', { name: /^Pay\b/ }).click();
  await page.waitForURL(/paystack\.com/i, { timeout: 60_000 });

  const payOnPaystack = page.getByRole('button', { name: /Pay NGN/i });
  await expect(payOnPaystack).toBeVisible({ timeout: 120_000 });

  await page.getByText('Success', { exact: true }).click();
  await payOnPaystack.click();

  await expect(page).toHaveURL(/\/confirmation/, { timeout: 90_000 });
  await expect(page.getByRole('heading', { name: /You.re booked/i })).toBeVisible({
    timeout: 45_000,
  });
  await expect(page.getByText(/Payment confirmed/i)).toBeVisible();
});
