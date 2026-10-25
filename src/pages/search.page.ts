import { type Locator, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class SearchPage {
  readonly header: HeaderComponent;
  readonly searchInput: Locator;
  readonly productCards: Locator;
  readonly noResultsMessage: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.productCards = page.locator('a[href*="/products/"]');
    this.noResultsMessage = page.getByText(/No results found for/i);
  }

  productHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }
}