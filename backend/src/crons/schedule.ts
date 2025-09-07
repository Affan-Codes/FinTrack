import cron from "node-cron";
import { processRecurringTransactions } from "./jobs/transaction.job";
import { processReportJob } from "./jobs/report.job";

const scheduleJob = (name: string, time: string, job: Function) => {
  console.log(`Schedule ${name} at ${time}`);

  return cron.schedule(
    time,
    async () => {
      try {
        await job();
        console.log(`${name} completed`);
      } catch (error) {
        console.log(`${name} failed`, error);
      }
    },
    { timezone: "UTC" }
  );
};

export const startJobs = () => {
  return [
    scheduleJob("Transactions", "5 0 * * *", processRecurringTransactions),
    scheduleJob("Reports", "30 2 1 * *", processReportJob),
  ];
};
