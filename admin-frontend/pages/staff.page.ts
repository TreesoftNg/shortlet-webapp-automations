import type { Page } from '@playwright/test';

export class AdminStaffPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/staff');
  }

  heading() {
    return this.page.getByRole('heading', { name: /^Staff$/i });
  }

  inviteButton() {
    return this.page.getByRole('button', { name: /Invite member/i });
  }
}
