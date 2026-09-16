import type { SessionItem } from "../types";

export const isSessionPastDue = (data: SessionItem) => {
  const end = new Date(data.sessionDate);
  if (Number.isNaN(end.getTime())) return false;

  const [hours, minutes] = data.endTime.split(":").map(Number);
  end.setHours(hours, minutes, 0, 0);

  return end.getTime() < Date.now();
};
