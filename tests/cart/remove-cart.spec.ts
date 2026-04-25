/**
 * Purpose: Cart test coverage for removing a product.
 * Why used: It validates users can undo cart actions and that cart state updates correctly.
 */
import { test } from '../../fixtures/testFixtures';
import { PRODUCTS } from '../../utils/constants';

test.describe('Cart', () => {
  test('User should remove a product from the cart', async ({ authenticatedInventoryPage, cartPage }) => {
    await test.step('Arrange: add a product and open the cart', async () => {
      await authenticatedInventoryPage.addProductToCart(PRODUCTS.BACKPACK.testId);
      await authenticatedInventoryPage.openCart();
      await cartPage.expectLoaded();
    });

    await test.step('Act: remove the product from the cart', async () => {
      await cartPage.removeProduct(PRODUCTS.BACKPACK.testId);
    });

    await test.step('Assert: product is no longer visible in the cart', async () => {
      await cartPage.expectProductRemoved(PRODUCTS.BACKPACK.name);
    });
  });
});
