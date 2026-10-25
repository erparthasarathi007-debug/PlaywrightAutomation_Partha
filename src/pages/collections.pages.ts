import { type Page } from '@playwright/test';
import { ProductGridComponent } from '../components/product-grid.component';

export class CollectionsPage {
  readonly productGrid: ProductGridComponent;

  constructor(private readonly page: Page) {
    this.productGrid = new ProductGridComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/collections');
  }

  async openCollection(name: string): Promise<void> {
    await this.page.getByRole('link', { name: new RegExp(name, 'i') }).click();
  }
}