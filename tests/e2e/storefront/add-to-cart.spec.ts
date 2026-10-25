import { test, expect } from '../../../src/fixtures/test.fixture';

test.describe('Add to Cart', () => {
  test('updates quantity and removes the item at zero', async ({
    page, homePage, productPage, cartPage,
  }) => {
    await homePage.goto();
    await homePage.openProduct('Grey jacket');

    const productName = await productPage.heading('Grey jacket').innerText();
    const productPrice = await productPage.price('£60.00').innerText();
    expect(productName).toBe('Grey jacket');
    expect(productPrice).toBe('£60.00');

    await expect(homePage.header.cartSummary(0)).toBeVisible();
    await productPage.addToCart();
    await expect(homePage.header.cartSummary(1)).toBeVisible();

    // The header summary changes the hash; it does not navigate to the cart.
    await homePage.header.cartSummary(1).click();
    await expect(page).toHaveURL(/#$/);
    await cartPage.goto();

    await expect(page).toHaveURL(/\/cart/);
    await expect(homePage.header.cartSummary(1)).toBeVisible();
    await expect(cartPage.itemImage(productName)).toBeVisible();
    await expect(cartPage.unitPrice(productPrice).first()).toBeVisible();
    await expect(cartPage.quantityInput).toHaveValue('1');

    await cartPage.setQuantity('2');
    await cartPage.update();
    await expect(cartPage.quantityInput).toHaveValue('2');
    await expect(cartPage.total('£110.00')).toBeVisible();

    await cartPage.setQuantity('0');
    await cartPage.update();
    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(homePage.header.cartSummary(0)).toBeVisible();
  });
});