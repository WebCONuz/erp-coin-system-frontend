import { BookOpen, Gift, Users } from "lucide-react";
import { FeaturedCoinCard } from "./FeaturedCoinCard";
import { StatCard } from "./StatCard";
import type { StudentDetailFull } from "../../types";
import { formatDate } from "@/ustils";

interface Props {
  student?: StudentDetailFull;
}
export const StatisticSection = ({ student }: Props) => {
  const attendancePercent = student?.stats?.totalSessions
    ? Math.round(
        (student?.stats.presentCount / student?.stats.totalSessions) * 100,
      )
    : 0;

  const lastTransaction = student?.coinTransactionsReceived?.[0];

  const lastCoinActivity = lastTransaction
    ? `${lastTransaction.direction === "earn" ? "+" : "-"}${lastTransaction.amount} · ${formatDate(lastTransaction.createdAt, "dd.MM.yyyy")}`
    : null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <FeaturedCoinCard
        balance={student?.wallet?.balance ?? 0}
        lastActivity={lastCoinActivity}
      />
      <StatCard
        icon={<Users size={20} className="text-blue-600" />}
        label="Guruhlar soni"
        value={student?.groupMemberships?.length ?? 0}
        iconBg="bg-blue-100 dark:bg-blue-900/40"
      />
      <StatCard
        icon={<Gift size={20} className="text-pink-600" />}
        label="Sotib olingan"
        value={student?.stats?.totalPurchases ?? 0}
        iconBg="bg-pink-100 dark:bg-pink-900/40"
      />
      <StatCard
        icon={<BookOpen size={20} className="text-green-600" />}
        label="Davomat"
        value={`${student?.stats?.presentCount ?? 0}/${student?.stats?.totalSessions ?? 0}`}
        iconBg="bg-green-100 dark:bg-green-900/40"
        ring={attendancePercent}
      />
    </div>
  );
};
