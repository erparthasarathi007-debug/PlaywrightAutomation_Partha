# Scenarios 5 and 6: Manual Test Steps

These steps describe the checks covered by
[`network-and-login.spec.ts`](../tests/e2e/storefront/network-and-login.spec.ts)
against the Sauce Demo Shopify storefront.

## Before you start

- Open `https://sauce-demo.myshopify.com` in a browser.
- For cart scenarios, use a fresh browser session or remove existing items from
  the cart first.
- To inspect requests, open browser developer tools and select **Network**.
  Enable **Preserve log** if available, then filter for `cart`.
- The default Noir jacket variant has a numeric Shopify variant ID. Do not
  assume the example ID is permanent; check the product form or the request
  payload for the value currently used by the site.

## Scenario 5A: Add Noir jacket and check the network/cart

1. Open the home page and select **Noir jacket**.
2. Confirm the product title is **Noir jacket** and the price is **£60.00**.
3. In **Network**, clear the request list, then click **Add to Cart**.
4. Find the POST request whose path is `/cart/add` (some Shopify versions use
   `/cart/add.js`). Open it and confirm its submitted `id` matches the selected
   product variant ID.
5. Check the add request's response status. The scenario accepts **200** or
   **302**; if it is **302**, confirm its `Location` points to `/cart`.
6. Open `https://sauce-demo.myshopify.com/cart.js` in the same browser session.
   Confirm `item_count` is `1`, there is one item titled **Noir jacket**, and
   its `price` is `6000` (Shopify returns money in pence, equivalent to £60.00).
   Confirm its `variant_id` matches the ID from step 4.
7. Return to the storefront and open **My Cart**. Confirm **Noir jacket** and
   **£60.00** are shown.

## Scenario 5B: Simulate a 500 response for Grey jacket

This check needs Playwright's request interception API; the regular browser UI
does not provide `page.route()`. In a Playwright test or other Playwright
automation, use this route handler before clicking **Add to Cart**:

```ts
await page.route('**/cart/add*', (route) =>
  route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ status: 500, message: 'Simulated server error' }),
  }),
);
```

1. Open the home page, then select **Grey jacket**.
2. Install the route handler above.
3. Click **Add to Cart** and inspect the `/cart/add` request; confirm its
   response status is **500**.
4. The demo does not reliably render a user-facing error message for this
   simulated response. It may display the response body or an error page instead.
5. Remove the interception with
   `await page.unroute('**/cart/add*')`.
6. In the same browser session, open `/cart.js` and confirm `item_count` is `0`.
7. Open `/cart` and confirm the cart is empty and the header shows **My Cart (0)**.

## Scenario 5C: Block the Striped top add request

This check also requires Playwright `page.route()`.

1. Start with an empty cart and open the home page.
2. Select **Striped top**, then install this route before adding it:

   ```ts
   await page.route('**/cart/add*', (route) => route.abort());
   ```

3. Click **Add to Cart**. The request should fail instead of receiving a normal
   cart response. The page may show a browser/network error.
4. Open `/cart.js` in the same browser session and confirm `item_count` is `0`.
5. Remove the route after the check with
   `await page.unroute('**/cart/add*')`.

## Scenario 6: Sign in with invalid details

1. Open the home page. If **Log In** is not visible, open the site menu first;
   alternatively, navigate directly to
   `https://sauce-demo.myshopify.com/account/login`.
2. Confirm the URL contains `/account/login` and the **Customer Login** form is
   visible.
3. Leave **Email Address** and **Password** empty and click **Sign In**.
   Confirm you remain on the login page. The browser or site may prevent an
   empty submission without showing an error.
4. Enter `test_fake@mail.com` as the email and an incorrect password, then
   click **Sign In**.
5. Confirm you are still on `/account/login` and the login form remains visible.
   The demo may show **Incorrect email or password.**, but it does not always
   return a visible error message.
6. Click **Forgot your password?**.
7. Confirm the **Reset Password** form appears, including the email field and
   the message **We will send you an email to reset your password.**

## Automated coverage

The corresponding Playwright tests are in
[`network-and-login.spec.ts`](../tests/e2e/storefront/network-and-login.spec.ts).
Run them in Chromium from the project root with:

```bash
npx playwright test --project=chromium tests/e2e/storefront/network-and-login.spec.ts
```
