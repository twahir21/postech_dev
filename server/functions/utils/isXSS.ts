export function isPotentialXSS(input: string): boolean {
  const xssPattern = /<\s*script|on\w+=|javascript:|<\s*iframe|<\s*img|document\.|window\.|eval\(|innerHTML\s*=|src\s*=|href\s*=/gi;
  return xssPattern.test(input);
}
