import { type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
  readonly searchLink: Locator;

  constructor(private readonly page: Page) {
    this.searchLink = page
      .getByRole('banner')
      .getByRole('link', { name: 'Search', exact: true });
  }

  cartSummary(count: number): Locator {
    return this.page
      .getByRole('banner')
      .getByRole('link', { name: `My Cart (${count})`, exact: true });
  }

  async openSearch(): Promise<void> {
    await this.searchLink.click();
  }
}