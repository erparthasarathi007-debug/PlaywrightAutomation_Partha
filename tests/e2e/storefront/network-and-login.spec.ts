import { test, expect } from '../../../src/fixtures/test.fixture';

type ShopifyCart = {
  item_count: number;
  items: Array<{
    product_title: string;
    price: number;
    quantity: number;
    variant_id: number;
  }>;
};

function isCartAddRequest(url: string): boolean {
  const pathname = new URL(url).pathname;
  return pathname.endsWith('/cart/add') || pathname.endsWith('/cart/add.js');
}

test.describe('Scenario 5: shopping journey and network checks', () => {
  test('adds Noir jacket and verifies its request, cart API, and cart page', async ({
    page, homePage, productPage, cartPage,
  }) => {
    await homePage.goto();
    await homePage.openProduct('Noir jacket');

    const productName = await productPage.heading('Noir jacket').innerText();
    const productPrice = await productPage.price('£60.00').innerText();
    const variantId = await page.locator('form[action*="/cart/add"] [name="id"]').inputValue();
    expect(productName).toBe('Noir jacket');
    expect(productPrice).toBe('£60.00');
    expect(variantId).toBeTruthy();

    const addResponsePromise = page.waitForResponse((response) =>
      isCartAddRequest(response.url()),
    );
    await productPage.addToCart();
    const addResponse = await addResponsePromise;

    expect([200, 302]).toContain(addResponse.status());
    if (addResponse.status() === 302) {
      expect(addResponse.headers().location).toMatch(/\/cart(?:\?|$)/);
    }
    const addRequest = addResponse.request();
    expect(`${addRequest.url()} ${addRequest.postData() ?? ''}`).toContain(variantId);

    const cartResponse = await page.request.get('/cart.js');
    expect(cartResponse.ok()).toBeTruthy();
    const cart = (await cartResponse.json()) as ShopifyCart;
    expect(cart.item_count).toBe(1);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].product_title).toBe('Noir jacket');
    expect(cart.items[0].price).toBe(6000);
    expect(cart.items[0].variant_id).toBe(Number(variantId));

    await cartPage.goto();
    await expect(homePage.header.cartSummary(1)).toBeVisible();
    await expect(cartPage.itemImage('Noir jacket')).toBeVisible();
    await expect(cartPage.unitPrice('£60.00').first()).toBeVisible();
  });

  test('handles a simulated server error without adding Grey jacket', async ({
    page, homePage, productPage, cartPage,
  }) => {
    await homePage.goto();
    // rout
    await homePage.openProduct('Grey jacket');
// sarathi
    await page.route('**/cart/add*', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ status: 500, message: 'Simulated server error' }),
      }),
    );

    const addResponsePromise = page.waitForResponse((response) =>
      isCartAddRequest(response.url()),
    );
    await productPage.addToCart();
    const addResponse = await addResponsePromise;
    expect(addResponse.status()).toBe(500);
    const errorMessage = page.getByText(/Simulated server error/);
    if (await errorMessage.count()) {
      await expect(errorMessage.first()).toBeVisible();
    }
    await page.unroute('**/cart/add*');

    const cartResponse = await page.request.get('/cart.js');
    expect(cartResponse.ok()).toBeTruthy();
    const cart = (await cartResponse.json()) as ShopifyCart;
    expect(cart.item_count).toBe(0);

    await cartPage.goto();
    await expect(homePage.header.cartSummary(0)).toBeVisible();
    await expect(cartPage.emptyMessage).toBeVisible();
    if (await errorMessage.count()) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('keeps cart empty when the Striped top add request is blocked', async ({
    page, homePage, productPage,
  }) => {
    await homePage.goto();
    await homePage.openProduct('Striped top');
    await page.route('**/cart/add*', (route) => route.abort());

    const failedAddPromise = page.waitForEvent('requestfailed', (request) =>
      isCartAddRequest(request.url()),
    );
    await productPage.addToCart();
    await failedAddPromise;

    const cartResponse = await page.request.get('/cart.js');
    expect(cartResponse.ok()).toBeTruthy();
    const cart = (await cartResponse.json()) as ShopifyCart;
    expect(cart.item_count).toBe(0);
  });
});

test.describe('Scenario 6: login with invalid details', () => {
  test('keeps invalid credentials on login and opens the password reset form', async ({
    page, loginPage,
  }) => {
    await loginPage.goto();
    await expect(page).toHaveURL(/\/account\/login/);

    await loginPage.signInButton.click();
    await expect(page).toHaveURL(/\/account\/login/);

    await loginPage.emailInput.fill('test_fake@mail.com');
    await loginPage.passwordInput.fill('wrong-password');
    await loginPage.signInButton.click();

    await expect(page).toHaveURL(/\/account\/login/);
    await expect(loginPage.emailInput).toBeVisible();
    if (await loginPage.errorMessage.count()) {
      await expect(loginPage.errorMessage).toBeVisible();
    }

    await loginPage.forgotPasswordLink.click();
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    await expect(
      page.getByText('We will send you an email to reset your password.'),
    ).toBeVisible();
  });
});
