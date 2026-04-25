# Sauce Demo Playwright TypeScript Framework

This project is a beginner-friendly but industry-style automation framework for [Sauce Demo](https://www.saucedemo.com).

It uses:

- Playwright for browser automation
- TypeScript for safer, readable test code
- Faker for dynamic test data
- Allure Report for clean execution reports
- Page Object Model for maintainable UI automation
- Environment files for dev, QA, and prod style configuration

## Project Structure

```text
project-root/
├── tests/                 # Test specs grouped by business feature
│   ├── login/
│   ├── cart/
│   └── checkout/
├── pages/                 # Page Object classes: locators + page actions
├── test-data/             # Static test data such as known login users
├── utils/                 # Generic utilities that are not page-specific
├── fixtures/              # Shared Playwright setup and reusable test objects
├── config/                # Environment and framework configuration
│   └── environments/
├── assets/                # Screenshots and future upload/download test files
├── reports/               # Generated reports
├── playwright.config.ts   # Playwright runner configuration
├── package.json           # Scripts and dependencies
├── tsconfig.json          # TypeScript compiler configuration
└── README.md
```

The main idea is separation of responsibility:

- Tests describe user behavior.
- Page objects know how to interact with pages.
- Fixtures prepare reusable setup.
- Config controls environments.
- Utils contain generic helpers only.

## File Purpose Guide

Most framework files include a short top comment explaining their purpose. Strict JSON files cannot safely contain comments, so their purpose is documented here.

| File | Purpose and why it is used |
| --- | --- |
| `package.json` | Defines npm scripts and dependencies so every team member runs the framework the same way. |
| `package-lock.json` | Locks exact installed dependency versions for repeatable installs across machines and CI. |
| `tsconfig.json` | Controls TypeScript type-checking so framework mistakes are caught early. |
| `playwright.config.ts` | Centralizes browser, reporter, screenshot, timeout, retry, and test directory settings. |
| `.gitignore` | Keeps generated files like `node_modules`, reports, and local artifacts out of source control. |
| `config/config.ts` | Loads environment variables and exposes one clean config object to tests and fixtures. |
| `config/environments/dev.env` | Stores development environment values without hardcoding them in tests. |
| `config/environments/qa.env` | Stores QA environment values and is the default automation target. |
| `config/environments/prod.env` | Stores production-like smoke test values separately to reduce environment mistakes. |
| `fixtures/testFixtures.ts` | Provides reusable page objects and login setup to reduce duplicate code in specs. |
| `pages/LoginPage.ts` | Contains login screen locators, actions, and assertions. |
| `pages/InventoryPage.ts` | Contains product inventory and add-to-cart behavior. |
| `pages/CartPage.ts` | Contains cart page actions and cart assertions. |
| `pages/CheckoutPage.ts` | Contains checkout form, overview, and order completion behavior. |
| `tests/login/login.spec.ts` | Verifies successful login behavior. |
| `tests/login/invalid-login.spec.ts` | Verifies important login error paths. |
| `tests/cart/add-to-cart.spec.ts` | Verifies users can add products to the cart. |
| `tests/cart/remove-cart.spec.ts` | Verifies users can remove products from the cart. |
| `tests/checkout/checkout.spec.ts` | Verifies the main checkout flow end to end. |
| `test-data/loginData.json` | Stores known login test data separately from test logic. |
| `test-data/users.json` | Stores reusable Sauce Demo user credentials for future scenarios. |
| `utils/constants.ts` | Centralizes product and route constants to avoid typo-based failures. |
| `utils/fakerUtils.ts` | Generates realistic dynamic test data for checkout and future user flows. |
| `utils/helpers.ts` | Stores generic non-page utilities such as timestamps and currency parsing. |
| `utils/waitHelpers.ts` | Stores condition-based wait helpers and avoids hard waits. |
| `utils/logger.ts` | Provides structured JSON logging for framework-level messages. |
| `assets/screenshots/.gitkeep` | Keeps the screenshots directory available before screenshots are generated. |
| `assets/test-files/.gitkeep` | Keeps a predictable folder for future upload/download test assets. |
| `reports/.gitkeep` | Keeps the reports directory visible before Playwright or Allure output exists. |

## Install

```bash
npm install
npm run install:browsers
```

If you were adding Allure manually to an existing project, the important command would be:

```bash
npm install -D allure-playwright allure-commandline
```

## Package Purpose

`package.json` is JSON, so it cannot contain real code comments. To keep it valid, this project uses a custom `dependencyPurpose` section and this table to explain why each package exists.

| Package | Purpose |
| --- | --- |
| `@playwright/test` | Playwright test runner, browser automation APIs, assertions, fixtures, and reporting hooks. |
| `typescript` | Static typing for safer framework code and easier refactoring. |
| `@types/node` | TypeScript definitions for Node.js features like `process.env` and `path`. |
| `dotenv` | Loads `dev.env`, `qa.env`, and `prod.env` values into `process.env`. |
| `@faker-js/faker` | Generates dynamic test data such as names, emails, passwords, and postal codes. |
| `allure-playwright` | Sends Playwright steps, failures, screenshots, and attachments to Allure. |
| `allure-commandline` | Generates and opens the final Allure HTML report. |

## Run Tests

The default environment is `qa`.

```bash
npm test
```

Run against a named environment:

```bash
npm run test:dev
npm run test:qa
npm run test:prod
```

Debug locally:

```bash
npm run test:headed
npm run test:headed:slow
npm run test:debug
npm run test:debug:slow
```

Control browser speed:

```powershell
npm run test:headed:slow
```

`test:headed:slow` opens the browser and slows each browser action by `700ms`. This is useful when you are learning because you can clearly see each click, fill, and navigation.

For custom speed in PowerShell:

```powershell
$env:SLOW_MO_MS='1000'; npm run test:headed
```

Use a smaller number like `300` for slightly slower runs, or a bigger number like `1000` when you want to watch every action carefully. Keep normal CI and regression runs fast with:

```powershell
npm test
```

You can also override the environment directly:

```powershell
$env:TEST_ENV='qa'; npm test
```

## Environment Management

Environment files live here:

```text
config/environments/dev.env
config/environments/qa.env
config/environments/prod.env
```

Example:

```env
BASE_URL=https://www.saucedemo.com
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```

Why this exists:

- Real projects usually have dev, QA, staging, and production-like URLs.
- Tests should not hardcode URLs or credentials in spec files.
- Changing the target environment should not require editing test code.

`config/config.ts` loads the correct file using `dotenv`.

`process.env` is Node.js global environment storage. After `dotenv` reads `qa.env`, values like `BASE_URL` become available as `process.env.BASE_URL`.

The framework exposes those values through one clean object:

```ts
export const config = {
  baseUrl: requiredEnv('BASE_URL'),
  username: requiredEnv('USERNAME'),
  password: requiredEnv('PASSWORD')
};
```

Tests and fixtures import `config` instead of reading environment variables everywhere.

This framework uses `SAUCE_USERNAME` and `SAUCE_PASSWORD` instead of generic names like `USERNAME` and `PASSWORD`. Generic names can collide with operating system variables, especially `USERNAME` on Windows.

## Page Object Model

Page objects live in `pages/`.

Example:

```ts
export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

Why this exists:

- Locators are kept in one place.
- Reusable page actions avoid copy-paste in tests.
- If the UI changes, you usually update one page object instead of many specs.

The constructor receives Playwright's `page` object. This is dependency injection: the test runner owns the browser page, and the page object uses it.

Good page object methods describe business actions:

- `login(username, password)`
- `addProductToCart(productTestId)`
- `checkout()`

Avoid page methods that are too low level unless they are genuinely reusable.

## Locator Strategy

Use stable locators in this order:

1. `getByTestId()`
2. `getByRole()`
3. `getByLabel()`
4. `getByText()`
5. CSS
6. XPath

Sauce Demo uses `data-test` attributes. In `playwright.config.ts`, this line makes `getByTestId()` use `data-test`:

```ts
testIdAttribute: 'data-test'
```

Why stable locators matter:

- UI layout and CSS classes change often.
- Long XPath selectors break when one wrapper div changes.
- User-facing roles and test ids usually survive visual redesigns better.

Use XPath only when there is no better stable locator.

## Test Case Structure

Tests use Arrange, Act, Assert.

```ts
test('User should login successfully with valid credentials', async ({ loginPage, inventoryPage }) => {
  await test.step('Arrange: open the login page', async () => {
    await loginPage.open();
  });

  await test.step('Act: submit valid credentials', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
  });

  await test.step('Assert: inventory page is displayed', async () => {
    await inventoryPage.expectLoaded();
  });
});
```

Why assertions are critical:

- A test without assertions can pass even when the app is broken.
- Assertions prove the business result happened, not just that clicks executed.
- Good assertions reduce false positives.

## Test Data

Static data lives in `test-data/`.

Dynamic data comes from Faker in `utils/fakerUtils.ts`.

```ts
export function createRandomUser(): RandomUser {
  return {
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 12 })
  };
}
```

Why dynamic data matters:

- Real systems often reject duplicate emails, IDs, or reference numbers.
- Dynamic data keeps tests independent.
- Faker makes data readable and realistic without hardcoding every value.

For Sauce Demo checkout, the framework generates a random first name, last name, and postal code.

## Fixtures

Fixtures live in `fixtures/testFixtures.ts`.

They create shared objects such as:

- `loginPage`
- `inventoryPage`
- `cartPage`
- `checkoutPage`
- `authenticatedInventoryPage`

Why fixtures exist:

- They reduce repeated setup code.
- They make common flows like login reusable.
- They keep tests focused on the behavior being verified.

Example:

```ts
test('User should add a product to the cart', async ({ authenticatedInventoryPage, cartPage }) => {
  await authenticatedInventoryPage.addProductToCart(PRODUCTS.BACKPACK.testId);
  await authenticatedInventoryPage.openCart();
  await cartPage.expectProductVisible(PRODUCTS.BACKPACK.name);
});
```

The test does not need to repeat login steps because the fixture handles that setup.

## Helpers vs Page Methods

Use page objects for page-specific behavior.

Wrong:

```ts
// helpers.ts
export async function clickLoginButton(page: Page) {}
```

Correct:

```ts
// LoginPage.ts
async login(username: string, password: string): Promise<void> {}
```

Use helpers for generic utilities:

- formatting dates
- parsing currency
- generating timestamps
- reusable wait wrappers
- structured logging

Do not create a huge helper file full of random UI actions. That makes the framework hard to maintain.

## Wait Strategy

Avoid hard waits:

```ts
await page.waitForTimeout(5000);
```

Hard waits are bad because:

- They make fast tests slow.
- They still fail when the app takes longer than expected.
- They hide real synchronization problems.

Prefer Playwright's built-in auto waiting:

```ts
await page.getByTestId('login-button').click();
await expect(page.getByTestId('inventory-list')).toBeVisible();
```

Use explicit waits only when waiting for a real condition:

```ts
await expect(locator).toBeVisible();
await expect(page).toHaveURL(/inventory\.html/);
```

## Screenshots, Trace, and Failure Debugging

Configured in `playwright.config.ts`:

```ts
screenshot: 'only-on-failure',
video: 'retain-on-failure',
trace: 'on-first-retry'
```

This means:

- Failed tests automatically keep screenshots.
- Failed/retried tests keep traces.
- Videos are retained only when useful for debugging.

Open the Playwright HTML report:

```bash
npm run report:playwright
```

## Allure Reporting

Allure is configured as a Playwright reporter:

```ts
['allure-playwright', { outputFolder: 'allure-results' }]
```

Run tests:

```bash
npm test
```

Generate the Allure report:

```bash
npm run report:allure:generate
```

Open the Allure report:

```bash
npm run report:allure:open
```

Allure is useful because it gives readable test history, steps, attachments, screenshots, and failure details.

## Best Practices

- Keep tests independent.
- Keep test names readable and behavior-focused.
- Prefer stable locators over layout-based selectors.
- Keep page objects focused on one page.
- Keep assertions close to the behavior being tested.
- Put API/config contracts in one place instead of duplicating assumptions.
- Use dynamic data when the application requires unique values.
- Keep setup in fixtures when it reduces repeated code.

## Common Beginner Mistakes

- Hardcoding URLs, usernames, and passwords in every test.
- Using `waitForTimeout()` instead of waiting for conditions.
- Copy-pasting the same login flow into every spec.
- Using long XPath selectors for everything.
- Putting page-specific clicks in `helpers.ts`.
- Writing tests that click buttons but never assert the result.
- Creating one giant page object for the entire application.
- Making tests depend on execution order.

## Current Example Coverage

Included test examples:

- successful login
- invalid login
- add product to cart
- remove product from cart
- complete checkout with Faker-generated customer data

This is enough to demonstrate the framework patterns without overengineering the training project.
