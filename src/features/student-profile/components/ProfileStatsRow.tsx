import { Coins, Gift, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import { RadialProgress } from "@/components/shared/charts";
import type { StudentDetailFull } from "@/features/students/types";

const AttendanceRingTile = ({
  present,
  total,
}: {
  present: number;
  total: number;
}) => {
  const { t } = useTranslation();
  const percent = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
      <RadialProgress
        percent={percent}
        size={56}
        strokeWidth={5}
        color="var(--success)"
        trackColor="var(--muted)"
      />
      <div className="min-w-0">
        <p className="font-heading text-xl font-bold text-foreground">
          {present}/{total}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("students.detail.attendance")}
        </p>
      </div>
    </div>
  );
};

export const ProfileStatsRow = ({
  student,
}: {
  student: StudentDetailFull;
}) => {
  const { t } = useTranslation();
  const lastTx = student.coinTransactionsReceived?.[0];
  const lastCoinActivity = lastTx
    ? `${lastTx.direction === "earn" ? "+" : "-"}${lastTx.amount} · ${formatDate(lastTx.createdAt, "dd.MM.yyyy")}`
    : null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-coin/30 bg-coin-soft/20 p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-coin/20 flex items-center justify-center shrink-0">
          <Coins size={20} className="text-coin" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-xl font-bold text-foreground">
            {student.wallet?.balance ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("students.detail.coinBalance")}
          </p>
          {lastCoinActivity && (
            <p className="text-[11px] text-primary font-medium mt-0.5">
              {lastCoinActivity}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
          <Users size={20} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-xl font-bold text-foreground">
            {student.groupMemberships?.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("students.detail.groupsCount")}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
          <Gift size={20} className="text-destructive" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-xl font-bold text-foreground">
            {student.stats?.totalPurchases ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("students.detail.purchased")}
          </p>
          {!student.stats?.totalPurchases && (
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              {t("studentProfile.stats.noPurchases")}
            </p>
          )}
        </div>
      </div>

      <AttendanceRingTile
        present={student.stats?.presentCount ?? 0}
        total={student.stats?.totalSessions ?? 0}
      />
    </div>
  );
};
