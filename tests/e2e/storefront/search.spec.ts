import { test, expect } from '../../../src/fixtures/test.fixture';

test.describe('Storefront search', () => {
  test('finds jackets', async ({ page, homePage, searchPage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle(/Sauce Demo/i);

    await homePage.header.openSearch();
    await expect(searchPage.searchInput).toBeVisible();
    await searchPage.searchFor('jacket');

    await expect(page).toHaveTitle(/search/i);
    await expect(page).toHaveURL(/\/search\?.*q=jacket/);
    await expect(searchPage.productHeading('Grey jacket')).toBeVisible();
    await expect(searchPage.productHeading('Noir jacket')).toBeVisible();
    // await expect(
    //   page.getByRole('heading', { name: /sandals|heels|shades/i }),
    // ).toHaveCount(0);
  });

  test('shows no products for an unmatched term', async ({ homePage, searchPage }) => {
    await homePage.goto();
    await homePage.header.openSearch();
    await searchPage.searchFor('zzznotaproduct123');
// sarathi
    await expect(searchPage.noResultsMessage).toBeVisible();
    await expect(searchPage.productCards).toHaveCount(0);
  });
});