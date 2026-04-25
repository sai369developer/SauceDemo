/**
 * Purpose: Shared constants for product names, product test ids, and route names.
 * Why used: Central constants prevent typo-based failures and make future app changes easier to update.
 */
export const PRODUCTS = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    testId: 'sauce-labs-backpack'
  }
} as const;

export const ROUTES = {
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutStepOne: '/checkout-step-one.html',
  checkoutStepTwo: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html'
} as const;
