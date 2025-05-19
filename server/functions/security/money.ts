import Decimal from 'decimal.js';

/**
 * Multiplies a price and quantity, safely returning a fixed decimal string
 */
export function calculateTotal(price: string, quantity: number): string {
  const total = new Decimal(price).times(quantity);
  return total.toFixed(2);
}

/**
 * Adds two prices together safely
 */
export function addAmounts(a: string, b: string): string {
  return new Decimal(a).plus(b).toFixed(2);
}

/**
 * Subtracts b from a
 */
export function subtractAmounts(a: string, b: string): string {
  return new Decimal(a).minus(b).toFixed(2);
}

/**
 * Converts a decimal string to a 2-decimal string
 */
export function formatDecimalString(value: string): string {
  return new Decimal(value).toFixed(2);
}

/**
 * Converts a float/number to a 2-decimal string
 */
export function formatFloatToFixed(value: number): string {
  return new Decimal(value).toFixed(2);
}
