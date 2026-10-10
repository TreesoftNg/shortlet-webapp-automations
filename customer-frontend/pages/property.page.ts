import type { Page } from '@playwright/test';

export class CustomerPropertyPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/?preview=1`);
    await this.page.goto(`/properties/${slug}`);
  }

  reserveButton() {
    return this.page
      .getByRole('button', { name: /Reserve|Book|Continue/i })
      .first();
  }
}
