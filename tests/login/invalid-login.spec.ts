/**
 * Purpose: Negative login test coverage for invalid and locked-out users.
 * Why used: Automation should verify both successful behavior and important validation/error paths.
 */
import { test } from '../../fixtures/testFixtures';
import loginData from '../../test-data/loginData.json';

test.describe('Invalid login', () => {
  test('User should see an error for locked out credentials', async ({ loginPage }) => {
    await test.step('Arrange: open the login page', async () => {
      await loginPage.open();
    });

    await test.step('Act: submit locked out user credentials', async () => {
      await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    });

    await test.step('Assert: correct error message is displayed', async () => {
      await loginPage.expectErrorMessage(loginData.invalidUser.expectedError);
    });
  });

  test('User should see an error for an incorrect password', async ({ loginPage }) => {
    await test.step('Arrange: open the login page', async () => {
      await loginPage.open();
    });

    await test.step('Act: submit wrong password', async () => {
      await loginPage.login(loginData.wrongPassword.username, loginData.wrongPassword.password);
    });

    await test.step('Assert: correct error message is displayed', async () => {
      await loginPage.expectErrorMessage(loginData.wrongPassword.expectedError);
    });
  });
});
