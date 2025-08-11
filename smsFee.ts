/**
 * Calculates the total SMS fee in Tanzanian Shillings (TZS).
 * @param smsCount Number of SMS messages.
 * @returns Total price in TZS.
 */
function smsFee(smsCount: number): number | string {
  if (smsCount <= 31) return "Fee less than 500 TZS are not allowed";
  const PRICE_PER_SMS = 16; // 16 TZS per SMS
  return smsCount * PRICE_PER_SMS;
}



// Example usage
console.log(smsFee(32)); // Output: 80 (5 SMS * 16 TZS)