export function replaceWith255(input: string): string {
  // Match the first number in the string
  const firstNumberMatch = input.match(/\d+/);
  
  if (!firstNumberMatch) {
    return input; // No numbers found, return original string
  }

  const firstNumber = firstNumberMatch[0];
  const startIndex = firstNumberMatch.index || 0;
  
  // Check if the first number is 0
  if (firstNumber === '0') {
    // Replace the 0 with 255 while preserving the rest of the string
    return input.substring(0, startIndex) + '255' + input.substring(startIndex + 1);
  }
  
  // If the first number is 255 or anything else, return the original string
  return input;
}