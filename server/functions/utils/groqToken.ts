// tokenTrackerGroq.ts

let tokenUsageThisMinute = 0;
let tokenUsageToday = 0;

let requestCountThisMinute = 0;
let requestCountToday = 0;

let lastMinute = Date.now();
let lastDay = new Date().getUTCDate();

const TPM_LIMIT = 15000;   // Tokens Per Minute limit
const TPD_LIMIT = 500000; // Tokens Per Day limit

const RPM_LIMIT = 30;   // Requests Per Minute
const RPD_LIMIT = 14400; // Requests Per Day

export function trackGroqTokens(tokensUsed: number) {
  const now = Date.now();
  const currentMinute = now;
  const currentDay = new Date().getUTCDate();

  // Reset minute counters
  if (currentMinute - lastMinute >= 60_000) {
    tokenUsageThisMinute = 0;
    requestCountThisMinute = 0;
    lastMinute = currentMinute;
  }

  // Reset daily counters
  if (currentDay !== lastDay) {
    tokenUsageToday = 0;
    requestCountToday = 0;
    lastDay = currentDay;
  }

  // Update counters
  tokenUsageThisMinute += tokensUsed;
  tokenUsageToday += tokensUsed;
  requestCountThisMinute += 1;
  requestCountToday += 1;

  // Warn if nearing limits
  if (tokenUsageThisMinute > TPM_LIMIT * 0.9) {
    console.warn("⚠️ Groq: Approaching TPM limit!");
  }
  if (tokenUsageToday > TPD_LIMIT * 0.9) {
    console.warn("⚠️ Groq: Approaching TPD limit!");
  }
  if (requestCountThisMinute > RPM_LIMIT * 0.9) {
    console.warn("⚠️ Groq: Approaching RPM limit!");
  }
  if (requestCountToday > RPD_LIMIT * 0.9) {
    console.warn("⚠️ Groq: Approaching RPD limit!");
  }

  return {
    TPM: {
      used: tokenUsageThisMinute,
      remaining: TPM_LIMIT - tokenUsageThisMinute,
      percentUsed: ((tokenUsageThisMinute / TPM_LIMIT) * 100).toFixed(2),
    },
    TPD: {
      used: tokenUsageToday,
      remaining: TPD_LIMIT - tokenUsageToday,
      percentUsed: ((tokenUsageToday / TPD_LIMIT) * 100).toFixed(2),
    },
    RPM: {
      used: requestCountThisMinute,
      remaining: RPM_LIMIT - requestCountThisMinute,
      percentUsed: ((requestCountThisMinute / RPM_LIMIT) * 100).toFixed(2),
    },
    RPD: {
      used: requestCountToday,
      remaining: RPD_LIMIT - requestCountToday,
      percentUsed: ((requestCountToday / RPD_LIMIT) * 100).toFixed(2),
    },
  };
}
