import { useTranslation } from "react-i18next";
import { BookOpen, Gift, UsersRound, type LucideIcon } from "lucide-react";
import { CoinAmount } from "@/components/shared/coin";
import { RadialProgress } from "@/components/shared/charts";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import type { StudentDetailFull } from "../../types";

interface Props {
  student?: StudentDetailFull;
}

/** Profil ko'rsatkichlari — bitta yaxlit qator (dashboard bilan bir xil). */
export const StatisticSection = ({ student }: Props) => {
  const { t } = useTranslation();
  const total = student?.stats?.totalSessions ?? 0;
  const present = student?.stats?.presentCount ?? 0;
  const attendancePercent = total ? Math.round((present / total) * 100) : 0;

  const last = student?.coinTransactionsReceived?.[0];

  return (
    <section aria-label={t("admin.dashboard.overview")}>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
        {/* Tanga balansi — asosiy ko'rsatkich */}
        <li className="col-span-2 bg-card px-4 py-4 sm:col-span-1 sm:px-5">
          <p className="text-sm text-muted-foreground">
            {t("students.detail.coinBalance")}
          </p>
          <CoinAmount
            value={student?.wallet?.balance ?? 0}
            size="lg"
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {last ? (
              <>
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    last.direction === "earn"
                      ? "text-success"
                      : "text-destructive",
                  )}
                >
                  {last.direction === "earn" ? "+" : "−"}
                  {last.amount}
                </span>
                {", "}
                {formatDate(last.createdAt, "dd.MM.yyyy")}
              </>
            ) : (
              t("students.detail.noLastActivity")
            )}
          </p>
        </li>

        <Stat
          icon={UsersRound}
          label={t("students.detail.groupsCount")}
          value={student?.groupMemberships?.length ?? 0}
        />
        <Stat
          icon={Gift}
          label={t("students.detail.purchased")}
          value={student?.stats?.totalPurchases ?? 0}
        />
        <li className="col-span-2 flex items-center justify-between gap-3 bg-card px-4 py-4 sm:col-span-1 sm:px-5">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="size-4" aria-hidden />
              {t("students.detail.attendance")}
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">
              {present}
              <span className="text-base text-muted-foreground">/{total}</span>
            </p>
          </div>
          <RadialProgress
            percent={attendancePercent}
            size={48}
            strokeWidth={5}
            color="var(--success)"
            trackColor="var(--muted)"
          >
            <span className="text-[11px] font-semibold tabular-nums">
              {attendancePercent}%
            </span>
          </RadialProgress>
        </li>
      </ul>
    </section>
  );
};

const Stat = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) => (
  <li className="bg-card px-4 py-4 sm:px-5">
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </p>
    <p className="mt-1 font-heading text-2xl font-semibold tabular-nums">
      {value}
    </p>
  </li>
);
