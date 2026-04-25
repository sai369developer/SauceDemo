/**
 * Purpose: Central Playwright runner configuration for browsers, reports, retries, screenshots, and timeouts.
 * Why used: Keeping runner behavior in one file makes the framework predictable and easy to update for every test.
 */
import { defineConfig, devices } from '@playwright/test';
import { config } from './config/config';

function readSlowMo(): number {
  // SLOW_MO_MS is optional.
  // Example: SLOW_MO_MS=500 means Playwright waits 500ms after each browser action.
  const slowMoValue = process.env.SLOW_MO_MS ?? '0';
  const slowMo = Number(slowMoValue);

  if (!Number.isInteger(slowMo) || slowMo < 0) {
    throw new Error(`SLOW_MO_MS must be a positive whole number. Received: ${slowMoValue}`);
  }

  return slowMo;
}

const slowMo = readSlowMo();

export default defineConfig({
  // Folder where Playwright looks for all test files.
  // In this framework, tests are grouped by feature under the tests/ folder.
  testDir: './tests',

  // Maximum time allowed for one test before Playwright fails it.
  // This prevents a broken test from hanging forever.
  timeout: 30_000,

  // Maximum time Playwright waits for an assertion like toBeVisible or toHaveURL.
  // Assertions wait automatically, so we do not need hard waits like waitForTimeout.
  expect: {
    timeout: 5_000
  },

  // Allows independent test files to run at the same time.
  // This makes execution faster, but tests must not depend on each other.
  fullyParallel: true,

  // Fails the build if someone accidentally commits test.only in CI.
  // test.only is useful locally, but dangerous in shared pipelines.
  forbidOnly: !!process.env.CI,

  // Retries flaky failures only in CI.
  // Local runs fail fast so the developer sees problems immediately.
  retries: process.env.CI ? 2 : 0,

  // Uses fewer workers in CI for stability.
  // Also uses 1 worker when slow motion is enabled so you can watch one browser flow clearly.
  // Locally without slow motion, Playwright decides the best worker count automatically.
  workers: process.env.CI || slowMo > 0 ? 1 : undefined,

  // Folder where Playwright stores raw failure artifacts such as screenshots, traces, and videos.
  outputDir: 'reports/test-results',

  // Reporters control how test results are shown.
  // list: readable terminal output.
  // html: built-in Playwright HTML report.
  // allure-playwright: raw Allure results used to generate the Allure HTML report.
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/playwright-html' }],
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }]
  ],

  // The use section contains browser/page defaults applied to every test.
  use: {
    // Base URL comes from config/environments/*.env.
    // Tests can call page.goto('/') instead of hardcoding the full application URL.
    baseURL: config.baseUrl,

    // Sauce Demo uses data-test attributes instead of data-testid.
    // This setting lets us write page.getByTestId('username') cleanly.
    testIdAttribute: 'data-test',

    // Trace records the browser timeline, DOM snapshots, network activity, and actions.
    // Keeping it on first retry gives useful debugging info without storing traces for every passing run.
    trace: 'on-first-retry',

    // Saves screenshots only for failed tests.
    // This keeps reports useful without filling the project with unnecessary images.
    screenshot: 'only-on-failure',

    // Keeps video only when a test fails.
    // Videos help understand what happened before the failure.
    video: 'retain-on-failure',

    // Maximum time for one browser action such as click, fill, or select.
    // This protects tests from waiting too long when an element is not actionable.
    actionTimeout: 10_000,

    // Maximum time for page navigation such as page.goto or redirects after login.
    navigationTimeout: 15_000,

    // Slows down each browser action when SLOW_MO_MS is set.
    // This is useful for learning and debugging because you can watch clicks, typing, and navigation.
    // Keep this at 0 for normal fast automation runs.
    launchOptions: {
      slowMo
    }
  },

  // Projects define which browsers/devices the suite runs against.
  // Start with Chromium for speed and stability; add Firefox/WebKit later when needed.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
