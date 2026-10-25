import { test, expect } from '../../../src/fixtures/test.fixture';

test.describe('Product Details', () => {
  test('checks Grey jacket details and Bronze sandals availability', async ({
    page, homePage, catalogPage, productPage,
  }) => {
    await homePage.goto();
    await homePage.openProduct('Grey jacket');

    await expect(page).toHaveURL(/\/products\/grey-jacket/);
    await expect(productPage.heading('Grey jacket')).toBeVisible();
    await expect(page).toHaveTitle(/Grey jacket/i);
    await expect(productPage.price('£55.00')).toBeVisible();
    await expect(productPage.description).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();

    await catalogPage.openFromSidebar();
    await catalogPage.productGrid.openProduct('Bronze sandals');
    await expect(productPage.heading('Bronze sandals')).toBeVisible();
    await expect(productPage.price('£39.99')).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();
  });
});