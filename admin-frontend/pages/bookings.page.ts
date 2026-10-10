import type { Page } from '@playwright/test';

export class AdminBookingsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/bookings');
  }

  heading() {
    return this.page.getByRole('heading', { name: /Bookings/i });
  }

  tab(name: string | RegExp) {
    return this.page.getByRole('tab', { name }).or(this.page.getByRole('button', { name }));
  }

  search() {
    return this.page.getByPlaceholder(/Search/i);
  }

  firstRow() {
    return this.page.locator('table tbody tr').first();
  }
}
