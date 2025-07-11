import { cleanResets, cleanupOldData, clearVerifiedEmails, isTrialEnd, pingAPI } from "./cronJobs";

setInterval(async () => await clearVerifiedEmails(), 2000 * 60 * 60); // every 2 hour
setInterval(() => pingAPI(), 1000 * 60 * 20); // warm up every 20 min 
setInterval(() => isTrialEnd(), 12000 * 60 * 60)  // run check trial or subscription after every 12 hours
// run to clear caches alongside 20min pingAPI
setInterval(async () => await cleanupOldData(), 48 * 1000 * 60 * 60) // every 2 full days.
setInterval(async () => await cleanResets(), 1000 * 60 * 60); // every 1 hour


// to run this file in background as worker use 
// bun run cron.ts & 

// use nohup bun run worker.ts > worker.log 2>&1 & for bun
// run jobs -l  to check if running
// to stop use kill 83248 (id of service)

// use pm2 for production 
// # Install PM2 globally
// npm i -g pm2

// # Run your cron job with it
// pm2 start cron.ts --interpreter bun --name "mypostech-cron"

// # It will auto-restart on crash and start on boot (with pm2 startup config)
// pm2 save


// to check if running
// you will see [1] 51093 means in shell 1 with id 51093
// to check background services use:  ps aux | grep bun
// to kill: kill 51093
