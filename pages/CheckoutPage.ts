/**
 * Purpose: Page Object for checkout customer details, overview, and completion screens.
 * Why used: Checkout is a multi-step flow, so central methods keep tests readable and reduce duplication.
 */
import { expect, type Locator, type Page } from '@playwright/test';
import type { CheckoutCustomer } from '../utils/fakerUtils';

export class CheckoutPage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
    this.errorMessage = page.getByTestId('error');
  }

  async enterCustomerInformation(customer: CheckoutCustomer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOverviewLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.finishButton).toBeVisible();
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectCheckoutError(message: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }
}
