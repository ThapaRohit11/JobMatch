import type { UserJob } from "./user-api";

export function isJobClosed(job: Pick<UserJob, "status" | "applyBy">) {
  if (job.status !== "Open") return true;
  if (!job.applyBy) return false;

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(job.applyBy.trim());
  const deadline = isoDate
    ? new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]))
    : new Date(job.applyBy);

  if (Number.isNaN(deadline.getTime())) return false;

  deadline.setHours(23, 59, 59, 999);
  return Date.now() > deadline.getTime();
}
