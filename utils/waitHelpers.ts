/**
 * Purpose: Small reusable wait helpers for real browser conditions.
 * Why used: Explicit condition-based waits are safer than hard waits like waitForTimeout.
 */
import { expect, type Locator, type Page } from '@playwright/test';

export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}

export async function waitForVisible(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
}
