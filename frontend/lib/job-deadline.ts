import type { UserJob } from "./user-api";

function parseDeadline(value: string) {
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  return isoDate
    ? new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]))
    : new Date(value);
}

export function formatJobDeadline(value?: string) {
  if (!value) return "Not set";

  const deadline = parseDeadline(value);
  if (Number.isNaN(deadline.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(deadline);
}

export function isJobClosed(job: Pick<UserJob, "status" | "applyBy">) {
  if (job.status !== "Open") return true;
  if (!job.applyBy) return false;

  const deadline = parseDeadline(job.applyBy);

  if (Number.isNaN(deadline.getTime())) return false;

  deadline.setHours(23, 59, 59, 999);
  return Date.now() > deadline.getTime();
}
