import { type Locator, type Page } from '@playwright/test';
import { ProductGridComponent } from '../components/product-grid.component';

export class CatalogPage {
  readonly heading: Locator;
  readonly sortMenu: Locator;
  readonly productGrid: ProductGridComponent;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Products', exact: true });
    this.sortMenu = page.locator('select[name="sort_by"]');
    this.productGrid = new ProductGridComponent(page);
  }

  async openFromSidebar(): Promise<void> {
    await this.page.getByRole('link', { name: 'Catalog', exact: true }).click();
  }

  async goto(): Promise<void> {
    await this.page.goto('/collections/all');
  }
}