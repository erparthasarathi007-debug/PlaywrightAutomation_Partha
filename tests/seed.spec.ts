// import { test, expect } from '@playwright/test';

// test.describe('Sauce Demo search', () => {
//   test('searching for jacket shows the expected results', async ({ page }) => {
//     await page.goto('https://sauce-demo.myshopify.com/');
//     await expect(page).toHaveTitle(/Sauce Demo/i);

//     await page.getByRole('link', { name: 'Search', exact: true }).first().click();

//     const search = page.getByRole('textbox', { name: 'Search' });
//     await expect(search).toBeVisible();
//     await search.fill('jacket');
//     await expect(search).toHaveValue('jacket');
//     await search.press('Enter');

//     // Soft assertions report both observed mismatches without stopping early.
//     await expect.soft(page).toHaveURL(/\/search\?q=jacket/);
//     await expect(page).toHaveTitle(/search/i);
//     await expect(page.getByRole('heading', { name: 'Grey jacket', exact: true })).toBeVisible();
//     await expect(page.getByRole('heading', { name: 'Noir jacket', exact: true })).toBeVisible();
//     await expect.soft(
//       page.getByRole('heading', { name: /sandals|heels|shades/i }),
//     ).toHaveCount(0);
//   });

//   test('an unmatched search shows no products', async ({ page }) => {
//     await page.goto('https://sauce-demo.myshopify.com/');
//     await page.getByRole('link', { name: 'Search', exact: true }).first().click();

//     const search = page.getByRole('textbox', { name: 'Search' });
//     await search.fill('zzznotaproduct123');
//     await search.press('Enter');

//     await expect(page.getByText('No results found for zzznotaproduct123')).toBeVisible();
//     await expect(page.locator('a[href*="/products/"]')).toHaveCount(0);
//   });
// });