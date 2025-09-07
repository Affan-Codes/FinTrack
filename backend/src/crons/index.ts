import { startJobs } from "./schedule";

export const initializeCrons = async () => {
  try {
    const jobs = startJobs();
    console.log(`⏰ ${jobs.length} cron jobs initialized`);
    return jobs;
  } catch (error) {
    console.error("CRON INIT ERROR: ", error);
    return [];
  }
};
