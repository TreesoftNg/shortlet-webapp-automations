import type { Page } from '@playwright/test';

export class CustomerHomePage {
  constructor(private readonly page: Page) {}

  async goto(preview = true) {
    await this.page.goto(preview ? '/?preview=1' : '/');
  }

  /** Brand or product name should be visible on first paint. */
  brand() {
    return this.page.getByText(/Sunmade/i).first();
  }

  searchLink() {
    return this.page.getByRole('link', { name: /Search|Browse|Explore/i }).first();
  }
}
