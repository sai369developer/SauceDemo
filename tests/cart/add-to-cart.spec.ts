/**
 * Purpose: Cart test coverage for adding a product.
 * Why used: It proves the inventory-to-cart flow works before checkout depends on it.
 */
import { test } from '../../fixtures/testFixtures';
import { PRODUCTS } from '../../utils/constants';

test.describe('Cart', () => {
  test('User should add a product to the cart', async ({ authenticatedInventoryPage, cartPage }) => {
    await test.step('Act: add a product to the cart', async () => {
      await authenticatedInventoryPage.addProductToCart(PRODUCTS.BACKPACK.testId);
      await authenticatedInventoryPage.expectCartCount(1);
      await authenticatedInventoryPage.openCart();
    });

    await test.step('Assert: product is visible in the cart', async () => {
      await cartPage.expectLoaded();
      await cartPage.expectProductVisible(PRODUCTS.BACKPACK.name);
    });
  });
});
