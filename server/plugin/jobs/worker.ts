import { Elysia } from 'elysia';
import { cron, Patterns } from '@elysiajs/cron';
import { 
  clearVerifiedEmails,
  isTrialEnd,
  cleanupOldData,
  cleanResets,
  notifyBeforeEnds,
  cleanCancelledPayments
} from './cronJobs';

export const bgJobsPlugin = new Elysia()
  // Clear verified emails everyday at 04:00
  .use(cron({
    name: 'clear-emails',
    pattern: Patterns.everyDayAt('04:00'), 
    async run() {
      try {
        console.time("clearVerifiedEmails");
        await clearVerifiedEmails();
        console.timeEnd("clearVerifiedEmails");
      } catch (error) {
        console.error('[Cron] clearVerifiedEmails failed:', error);
      }
    }
  }))
  
  
  // Check trial status every 12 hours at :30
  .use(cron({
    name: 'trial-check',
    pattern: Patterns.everyDayAt('03:00'), 
    async run() {
      try {
        console.time("trialCheck")
        await isTrialEnd();
        console.timeEnd("trialCheck")
      } catch (error) {
        console.error('[Cron] Trial check failed:', error);
      }
    }
  }))
  
  // Cleanup old data every 2 days at midnight
  .use(cron({
    name: 'old-data-cleanup',
    pattern: Patterns.everyDayAt('02:00'), 
    async run() {
      try {
        console.time("cleanupOldData");
        await cleanupOldData();
        console.timeEnd("cleanupOldData");
      } catch (error) {
        console.error('[Cron] Data cleanup failed:', error);
      }
    }
  }))

  // Cleanup cancelled payments at 03:00 every 
  .use(cron({
    name: 'cancelled-payments-cleanup',
    pattern: Patterns.everyDayAt('00:00'), 
    async run() {
      try {
        console.time("cleanupCancelledPayments");
        await cleanCancelledPayments();
        console.timeEnd("cleanupCancelledPayments");
      } catch (error) {
        console.error('[Cron] Cancelled payments cleanup failed:', error);
      }
    }
  }))
  
  // Clean resets everyday at 8:15 AM
  .use(cron({
    name: 'reset-cleanup',
    pattern: Patterns.everyDayAt('11:00'), 
    async run() {
      try {
        console.time("reset-cleanup")
        await cleanResets();
        console.timeEnd("reset-cleanup")
      } catch (error) {
        console.error('[Cron] Reset cleanup failed:', error);
      }
    }
  }))

  // Notify before trial ends (daily at 5:00 AM)
  .use(cron({
    name: 'trial-notifications',
    pattern: Patterns.everyDayAt('05:00'), 
    async run() {
      try {
        console.time("trial-notification")
        await notifyBeforeEnds();
        console.timeEnd("trial-notification")
      } catch (error) {
        console.error('[Cron] Trial notifications failed:', error);
      }
    }
  }))

