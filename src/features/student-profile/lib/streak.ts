import type { DashboardTransaction } from "../types";

/**
 * Approximate "days in a row with attendance" streak, derived from the
 * recent transactions feed (there is no dedicated streak field in the API).
 * Counts consecutive calendar days — starting today or yesterday — that
 * have at least one "attendance" earn transaction.
 */
export function computeAttendanceStreak(
  transactions: DashboardTransaction[],
): number {
  const attendanceDays = new Set(
    transactions
      .filter((tx) => tx.sourceType === "attendance" && tx.direction === "earn")
      .map((tx) => new Date(tx.createdAt).toDateString()),
  );

  if (attendanceDays.size === 0) return 0;

  const today = new Date();
  let streak = 0;
  let cursor = today;

  if (!attendanceDays.has(today.toDateString())) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!attendanceDays.has(yesterday.toDateString())) return 0;
    cursor = yesterday;
  }

  while (attendanceDays.has(cursor.toDateString())) {
    streak += 1;
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
