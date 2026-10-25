import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly description: Locator;
  readonly addToCartButton: Locator;
  readonly soldOutLabel: Locator;

  constructor(private readonly page: Page) {
    this.description = page.getByText(/This area is populated by the product description/);
    this.addToCartButton = page.getByRole('button', { name: /Add\s+to\s+Cart/i });
    this.soldOutLabel = page.getByText('Sold Out', { exact: true });
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  price(value: string): Locator {
    return this.page.getByRole('heading', { name: value, exact: true });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}