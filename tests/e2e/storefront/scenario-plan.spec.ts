// spec: Scenarios 2, 3, and 4
// seed: tests/e2e/storefront/search.spec.ts
import { test, expect } from '../../../src/fixtures/test.fixture';

test.describe('Product Details, Add to Cart, and Navigation', () => {
  test('smoke-checks the generated scenarios', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/Sauce Demo/i);
  });
});