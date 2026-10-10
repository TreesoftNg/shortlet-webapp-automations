import type { Page } from '@playwright/test';

export class AdminLoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  heading() {
    return this.page.getByRole('heading', { name: /Sign in/i });
  }

  email() {
    return this.page.getByLabel('Email');
  }

  password() {
    return this.page.getByLabel('Password');
  }

  submit() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }
}
