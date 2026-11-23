import { useMemo } from "react";
import { format, startOfMonth } from "date-fns";
import { MAX_PAGE_LIMIT } from "@/ustils";
import { useMyGroups } from "./useMyGroups";
import { useMyCoinHistory } from "./useMyCoin";
import { useMyAttendance } from "./useMyAttendance";
import { useDashboard } from "./useDashboard";
import type { MyGroupItem, DashboardSession } from "../types";

export interface GroupOverview extends MyGroupItem {
  coinThisMonth: number;
  attendanceRate: number;
  homeworkDone: number;
  homeworkTotal: number;
  nextSession: DashboardSession | null;
}

// Joriy oy boshi (`YYYY-MM-DD`, mahalliy sana) — `my-history` `from` ni tenant
// kunining boshidan hisoblaydi, shuning uchun "shu oy" coinlari to'liq keladi.
const getMonthStart = () => format(startOfMonth(new Date()), "yyyy-MM-dd");

export const useMyGroupsOverview = () => {
  const groupsQuery = useMyGroups();
  // Backend `limit` ≤ 100 (oshsa 400).
  const coinQuery = useMyCoinHistory({
    limit: String(MAX_PAGE_LIMIT),
    from: getMonthStart(),
  });
  const attendanceQuery = useMyAttendance({ limit: MAX_PAGE_LIMIT });
  const dashboardQuery = useDashboard();

  const isLoading =
    groupsQuery.isLoading || coinQuery.isLoading || attendanceQuery.isLoading;

  const data = useMemo<GroupOverview[]>(() => {
    const groups = groupsQuery.data ?? [];
    const coinTx = coinQuery.data?.data ?? [];
    const attendance = attendanceQuery.data?.data ?? [];
    const upcoming: DashboardSession[] = [
      ...(dashboardQuery.data?.todaySessions ?? []),
      ...(dashboardQuery.data?.upcomingSessions ?? []),
    ];
    const now = new Date();

    return groups.map((group) => {
      const coinThisMonth = coinTx
        .filter((tx) => {
          if (tx.group?.id !== group.id) return false;
          const d = new Date(tx.createdAt);
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        })
        .reduce(
          (sum, tx) =>
            sum + (tx.direction === "earn" ? tx.amount : -tx.amount),
          0,
        );

      const groupAttendance = attendance.filter(
        (r) => r.session.group.id === group.id,
      );
      const attendanceRate = groupAttendance.length
        ? Math.round(
            (groupAttendance.filter((r) => r.isPresent).length /
              groupAttendance.length) *
              100,
          )
        : 0;

      const nextSession =
        upcoming
          .filter((s) => s.group.id === group.id)
          .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))[0] ??
        null;

      return {
        ...group,
        coinThisMonth,
        attendanceRate,
        homeworkDone: groupAttendance.filter((r) => r.homeworkDone).length,
        homeworkTotal: groupAttendance.length,
        nextSession,
      };
    });
  }, [groupsQuery.data, coinQuery.data, attendanceQuery.data, dashboardQuery.data]);

  return { data, isLoading };
};
