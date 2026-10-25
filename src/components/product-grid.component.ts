import { type Locator, type Page } from '@playwright/test';

export class ProductGridComponent {
  readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('a[href*="/products/"]');
  }

  card(name: string): Locator {
    return this.cards.filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    });
  }

  heading(name: string): Locator {
    return this.card(name).getByRole('heading', { name, exact: true });
  }

  async openProduct(name: string): Promise<void> {
    await this.card(name).click();
  }

  async names(): Promise<string[]> {
    return this.cards.getByRole('heading', { level: 3 }).allInnerTexts();
  }

  async prices(): Promise<string[]> {
    return this.cards.getByRole('heading', { level: 4 }).allInnerTexts();
  }
}