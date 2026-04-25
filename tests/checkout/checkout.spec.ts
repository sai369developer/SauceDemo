/**
 * Purpose: End-to-end checkout coverage from product selection to order completion.
 * Why used: Checkout is the main business flow and validates multiple pages working together.
 */
import { test } from '../../fixtures/testFixtures';
import { PRODUCTS } from '../../utils/constants';
import { createCheckoutCustomer } from '../../utils/fakerUtils';

test.describe('Checkout', () => {
  test('User should complete checkout successfully', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutPage
  }) => {
    const customer = createCheckoutCustomer();

    await test.step('Arrange: add a product and start checkout', async () => {
      await authenticatedInventoryPage.addProductToCart(PRODUCTS.BACKPACK.testId);
      await authenticatedInventoryPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.checkout();
    });

    await test.step('Act: enter customer details and place the order', async () => {
      await checkoutPage.enterCustomerInformation(customer);
      await checkoutPage.expectOverviewLoaded();
      await checkoutPage.finishOrder();
    });

    await test.step('Assert: order completion message is displayed', async () => {
      await checkoutPage.expectOrderComplete();
    });
  });
});
