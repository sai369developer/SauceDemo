/**
 * Purpose: Page Object for the shopping cart screen.
 * Why used: Cart assertions and actions stay close to the cart UI instead of being copied into specs.
 */
import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  private readonly cartList: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.cartList = page.getByTestId('cart-list');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.cartList).toBeVisible();
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.cartList.getByText(productName)).toBeVisible();
  }

  async expectProductRemoved(productName: string): Promise<void> {
    await expect(this.cartList.getByText(productName)).toBeHidden();
  }

  async removeProduct(productTestId: string): Promise<void> {
    await this.page.getByTestId(`remove-${productTestId}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
