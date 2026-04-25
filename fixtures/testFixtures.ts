/**
 * Purpose: Custom Playwright fixtures that provide page objects and authenticated setup.
 * Why used: Fixtures remove repeated setup code and keep tests focused on the behavior under test.
 */
import { test as base, expect, type Page } from '@playwright/test';
import { config } from '../config/config';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
  authenticatedInventoryPage: InventoryPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  authenticatedPage: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.login(config.username, config.password);
    await inventoryPage.expectLoaded();
    await use(page);
  },

  authenticatedInventoryPage: async ({ authenticatedPage, inventoryPage }, use) => {
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  }
});

export { expect };
