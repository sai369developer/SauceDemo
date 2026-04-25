/**
 * Purpose: Valid login test coverage for Sauce Demo.
 * Why used: Login is a critical entry point, so the framework verifies successful access before deeper flows.
 */
import { test, expect } from '../../fixtures/testFixtures';
import loginData from '../../test-data/loginData.json';

test.describe('Login', () => {
  test('User should login successfully with valid credentials', async ({ page, loginPage, inventoryPage }) => {
    await test.step('Arrange: open the login page', async () => {
      await loginPage.open();
      await loginPage.expectLoginFormVisible();
    });

    await test.step('Act: submit valid credentials', async () => {
      await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    });

    await test.step('Assert: inventory page is displayed', async () => {
      await inventoryPage.expectLoaded();
      await expect(page).toHaveURL(/inventory\.html/);
    });
  });
});
