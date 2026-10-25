import { test as base, expect } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { CatalogPage } from '../pages/catalog.page';
import { CollectionsPage } from '../pages/collections.pages';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { SearchPage } from '../pages/search.page';

type AppFixtures = {
  cartPage: CartPage;
  catalogPage: CatalogPage;
  collectionsPage: CollectionsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  searchPage: SearchPage;
};

export const test = base.extend<AppFixtures>({
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  collectionsPage: async ({ page }, use) => use(new CollectionsPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
});

export { expect };