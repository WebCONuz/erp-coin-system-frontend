import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";

export const FeaturedCoinCard = ({
  balance,
  lastActivity,
}: {
  balance: number;
  lastActivity: string | null;
}) => (
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
        <p className="text-[11px] text-amber-700/60 dark:text-amber-400/60 mt-0.5">
          {lastActivity ?? "Oxirgi harakat yo'q"}
        </p>
      </div>
    </CardContent>
  </Card>
);
