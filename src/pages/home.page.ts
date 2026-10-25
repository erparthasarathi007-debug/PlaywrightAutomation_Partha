import { type Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { ProductGridComponent } from '../components/product-grid.component';

export class HomePage {
  readonly header: HeaderComponent;
  readonly productGrid: ProductGridComponent;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.productGrid = new ProductGridComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openProduct(name: string): Promise<void> {
    await this.productGrid.openProduct(name);
  }
}