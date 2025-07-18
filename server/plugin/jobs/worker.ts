import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import { 
  clearVerifiedEmails,
  pingAPI,
  isTrialEnd,
  cleanupOldData,
  cleanResets,
  notifyBeforeEnds
} from './cronJobs';

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
  
  // Warm up API every 20 minutes
  .use(cron({
    name: 'api-warmup',
    pattern: '*/20 * * * *', // Every 20 minutes
    run() {
      try {
        console.time("pingAPI");
        pingAPI();
        console.timeEnd("pingAPI");
      } catch (error) {
        console.error('[Cron] API warmup failed:', error);
      }
    }
  }))
  
  // Check trial status every 12 hours at :30
  .use(cron({
    name: 'trial-check',
    pattern: '30 */12 * * *', // At minute 30 of every 12th hour
    async run() {
      try {
        console.log('[Cron] Checking trial status...');
        await isTrialEnd();
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
  
  // Clean resets every hour at :15
  .use(cron({
    name: 'reset-cleanup',
    pattern: '15 * * * *', // At minute 15 of every hour
    async run() {
      try {
        console.log('[Cron] Running cleanResets...');
        await cleanResets();
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
        console.log('[Cron] Sending trial end notifications...');
        await notifyBeforeEnds();
      } catch (error) {
        console.error('[Cron] Trial notifications failed:', error);
      }
    }
  }))
  .listen(3010);

