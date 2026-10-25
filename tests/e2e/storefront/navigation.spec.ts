import { test, expect } from '../../../src/fixtures/test.fixture';

const catalogProducts = [
  'Black heels',
  'Bronze sandals',
  'Brown Shades',
  'Grey jacket',
  'Noir jacket',
  'Striped top',
  'White sandals',
];

test.describe('Navigation', () => {
  test('navigates Catalog, product details, history, and Frontpage', async ({
    page, homePage, catalogPage, collectionsPage, productPage,
  }) => {
    await homePage.goto();
    await catalogPage.openFromSidebar();

    await expect(page).toHaveURL(/\/collections\/all/);
    await expect(catalogPage.heading).toBeVisible();

    if (await catalogPage.sortMenu.isVisible()) {
      await catalogPage.sortMenu.selectOption('price-ascending');
      await expect(page).toHaveURL(/sort_by=price-ascending/);

      const prices = (await catalogPage.productGrid.prices())
        .map((price) => Number(price.replace(/[^\d.]/g, '')));
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    }

    for (const name of catalogProducts) {
      await expect(catalogPage.productGrid.heading(name)).toBeVisible();
    }

    await catalogPage.productGrid.openProduct('Noir jacket');
    await expect(productPage.heading('Noir jacket')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/collections\/all(?:\?.*)?$/);
    for (const name of catalogProducts) {
      await expect(catalogPage.productGrid.heading(name)).toBeVisible();
    }

    await collectionsPage.goto();
    await collectionsPage.openCollection('Frontpage');
    await expect(page).toHaveURL(/\/collections\/frontpage/);
    await expect(collectionsPage.productGrid.cards.first()).toBeVisible();
  });
});