import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";

const DeltaBadge = ({ label, value }: { label: string; value: number }) => {
  if (value === 0) return null;
  const isPositive = value > 0;
  return (
    <span
      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
        isPositive
          ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
      }`}
    >
      {isPositive ? "+" : ""}
      {value} {label}
    </span>
  );
};

interface Props {
  balance: number;
  weekDelta: number;
  monthDelta: number;
}

export const WalletCard = ({ balance, weekDelta, monthDelta }: Props) => (
  <Card className="border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20">
    <CardContent className="flex items-center gap-4 p-5">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-amber-100 dark:bg-amber-900/50">
        <Coins size={20} className="text-amber-600 dark:text-amber-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
          Coin balansi
        </p>
        <p className="text-xl font-bold text-amber-800 dark:text-amber-300 leading-tight">
          {balance}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <DeltaBadge label="shu hafta" value={weekDelta} />
          <DeltaBadge label="shu oy" value={monthDelta} />
        </div>
      </div>
    </CardContent>
  </Card>
);
