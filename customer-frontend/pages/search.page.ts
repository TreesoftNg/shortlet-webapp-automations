import type { Page } from '@playwright/test';

export class CustomerSearchPage {
  constructor(private readonly page: Page) {}

  async goto(query = '') {
    await this.page.goto(`/?preview=1`);
    await this.page.goto(`/search${query ? `?${query}` : ''}`);
  }

  listingCards() {
    return this.page.locator('a[href*="/properties/"]');
  }

  async openFirstListing() {
    const first = this.listingCards().first();
    await first.click();
    await this.page.waitForURL(/\/properties\//);
  }
}
