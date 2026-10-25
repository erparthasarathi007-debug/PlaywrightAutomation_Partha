import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly quantityInput: Locator;
  readonly updateButton: Locator;
  readonly emptyMessage: Locator;

  constructor(private readonly page: Page) {
    this.quantityInput = page.locator('#cart input[id^="updates_"]');
    this.updateButton = page.getByRole('button', { name: 'Update', exact: true });
    this.emptyMessage = page.getByText(/cart is currently empty/i);
  }

  itemImage(name: string): Locator {
    return this.page.getByRole('img', { name: new RegExp(name, 'i') });
  }

  unitPrice(value: string): Locator {
    return this.page
      .locator('#cart .price:visible')
      .filter({ hasText: value });
  }

  total(value: string): Locator {
    return this.page.getByRole('heading', {
      name: `Total ${value}`,
      exact: true,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
  }

  async setQuantity(value: string): Promise<void> {
    await this.quantityInput.fill(value);
  }

  async update(): Promise<void> {
    await this.updateButton.click();
  }
}