export function isPastApplyBy(applyBy, now = new Date()) {
  if (!applyBy) return false;

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(applyBy.trim());
  const deadline = isoDate
    ? new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]))
    : new Date(applyBy);

  if (Number.isNaN(deadline.getTime())) return false;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDay = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );

  return today > deadlineDay;
}

export function effectiveJobStatus(job, now = new Date()) {
  return job.status === "Open" && !isPastApplyBy(job.applyBy, now)
    ? "Open"
    : "Closed";
}
