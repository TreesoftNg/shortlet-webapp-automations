import type { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class CustomerCheckoutPage {
  constructor(private readonly page: Page) {}

  async gotoEmpty() {
    await this.page.goto('/?preview=1');
    await this.page.goto('/checkout');
  }

  emptyState() {
    return this.page.getByText(/Browse|select a stay|No stay|missing/i).first();
  }

  async fillGuestDetails() {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const email = faker.internet.email({ firstName: first, lastName: last });

    const firstName = this.page.getByLabel(/First name/i);
    const lastName = this.page.getByLabel(/Last name/i);
    const emailField = this.page.getByLabel(/^Email/i);
    const phone = this.page.getByLabel(/Phone/i);

    if (await firstName.isVisible().catch(() => false)) {
      await firstName.fill(first);
    }
    if (await lastName.isVisible().catch(() => false)) {
      await lastName.fill(last);
    }
    if (await emailField.isVisible().catch(() => false)) {
      await emailField.fill(email);
    }
    if (await phone.isVisible().catch(() => false)) {
      await phone.fill('+2348012345678');
    }

    return { first, last, email };
  }

  payButton() {
    return this.page.getByRole('button', { name: /Pay|Confirm|Complete/i }).first();
  }
}
