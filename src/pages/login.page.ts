import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
    this.errorMessage = page.getByText('Incorrect email or password.', { exact: true });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/account/login');
  }
}
