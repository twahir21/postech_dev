import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import { 
  clearVerifiedEmails,
  isTrialEnd,
  cleanupOldData,
  cleanResets,
  notifyBeforeEnds
} from './cronJobs';
import { LogSnag1 } from '../app/logSnag';

export const bgJobsPlugin = new Elysia()
  // Clear verified emails every 2 hours
  .use(cron({
    name: 'clear-emails',
    pattern: '0 */12 * * *', // At minute 0 of every 12 hours
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
    pattern: '30 */12 * * *', // At minute 30 of every 12th hour
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
    name: 'data-cleanup',
    pattern: '0 0 */2 * *', // At 00:00 every 2nd day
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
  
  // Clean resets everyday at 8:15 AM
  .use(cron({
    name: 'reset-cleanup',
    pattern: '15 8 * * *', 
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
  
  // Notify before trial ends (daily at 9:30 AM)
  .use(cron({
    name: 'trial-notifications',
    pattern: '30 9 * * *', // At 09:30 daily
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

