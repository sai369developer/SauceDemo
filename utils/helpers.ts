/**
 * Purpose: Generic helper functions that are not tied to any specific page.
 * Why used: Utilities like timestamps and text parsing can be reused without mixing UI responsibilities.
 */
export function buildTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

export function toCurrencyNumber(priceText: string): number {
  return Number(priceText.replace(/[^0-9.]/g, ''));
}
