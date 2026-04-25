/**
 * Purpose: Page Object for the product inventory screen after login.
 * Why used: Cart and product actions are shared across cart and checkout tests.
 */
import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  private readonly title: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly inventoryList: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.inventoryList = page.getByTestId('inventory-list');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
    await expect(this.inventoryList).toBeVisible();
  }

  async addProductToCart(productTestId: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productTestId}`).click();
  }

  async removeProductFromCart(productTestId: string): Promise<void> {
    await this.page.getByTestId(`remove-${productTestId}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartEmpty(): Promise<void> {
    await expect(this.cartBadge).toBeHidden();
  }
}
