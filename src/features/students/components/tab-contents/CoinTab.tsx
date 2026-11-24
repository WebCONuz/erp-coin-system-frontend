import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CoinIcon } from "@/components/shared/coin";
import { cn } from "@/lib/utils";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { translateApiError } from "@/ustils";
import { useManualCoinTransaction } from "../../hooks";
import { COIN_NOTE_MAX, MANUAL_COIN_MAX } from "../../constants";
import { CoinHistoryList } from "./CoinHistoryList";

interface CoinFormState {
  amount: string;
  note: string;
}

const emptyCoinForm: CoinFormState = { amount: "", note: "" };

export const CoinTab = ({ isDeleted }: { isDeleted: boolean }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const manualCoin = useManualCoinTransaction(id ?? "");
  const [coinForms, setCoinForms] = useState<
    Record<"earn" | "deduct", CoinFormState>
  >({
    earn: emptyCoinForm,
    deduct: emptyCoinForm,
  });

  const handleCoinAction = (direction: "earn" | "deduct") => {
    const amount = Number(coinForms[direction].amount);
    if (!amount || amount < 1 || !id) return;
    if (amount > MANUAL_COIN_MAX) {
      toast.error(t("bulkCoin.schema.amount_max", { max: MANUAL_COIN_MAX }));
      return;
    }
    manualCoin.mutate(
      {
        studentId: id,
        amount,
        direction,
        sourceType: "manual",
        note: coinForms[direction].note || undefined,
      },
      {
        onSuccess: () =>
          setCoinForms((p) => ({ ...p, [direction]: emptyCoinForm })),
        onError: (error) => toast.error(translateApiError(error, t)),
      },
    );
  };

  return (
    <TabsContent value="coins" className="mt-4 space-y-4">
      {!isDeleted && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(["earn", "deduct"] as const).map((dir) => {
            const isEarn = dir === "earn";
            const amountId = `coin-${dir}-amount`;
            const noteId = `coin-${dir}-note`;
            return (
              <form
                key={dir}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCoinAction(dir);
                }}
                className="space-y-3 rounded-2xl border bg-card p-4"
              >
                <h3 className="flex items-center gap-2 font-heading text-sm font-semibold">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full",
                      isEarn
                        ? "bg-success-soft text-success"
                        : "bg-destructive-soft text-destructive",
                    )}
                    aria-hidden
                  >
                    {isEarn ? <Plus size={14} /> : <Minus size={14} />}
                  </span>
                  {isEarn
                    ? t("students.coinTab.addCoin")
                    : t("students.coinTab.deductCoin")}
                </h3>
                <div className="grid grid-cols-[7rem_1fr] gap-2">
                  <div className="space-y-1">
                    <label
                      htmlFor={amountId}
                      className="text-xs text-muted-foreground"
                    >
                      {t("common.amount")}
                    </label>
                    <Input
                      id={amountId}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={MANUAL_COIN_MAX}
                      value={coinForms[dir].amount}
                      onChange={(e) =>
                        setCoinForms((p) => ({
                          ...p,
                          [dir]: { ...p[dir], amount: e.target.value },
                        }))
                      }
                      placeholder="0"
                      className="h-10 tabular-nums"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={noteId}
                      className="text-xs text-muted-foreground"
                    >
                      {t("students.coinTab.reason")}
                    </label>
                    <Input
                      id={noteId}
                      type="text"
                      maxLength={COIN_NOTE_MAX}
                      value={coinForms[dir].note}
                      onChange={(e) =>
                        setCoinForms((p) => ({
                          ...p,
                          [dir]: { ...p[dir], note: e.target.value },
                        }))
                      }
                      placeholder={t("common.optional")}
                      className="h-10"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant={isEarn ? "default" : "outline"}
                  disabled={!coinForms[dir].amount || manualCoin.isPending}
                  className={cn(
                    "h-10 w-full gap-2",
                    !isEarn &&
                      "border-destructive/40 text-destructive hover:bg-destructive-soft hover:text-destructive",
                  )}
                >
                  <CoinIcon className="size-4" />
                  {isEarn ? t("common.add") : t("students.coinTab.deduct")}
                </Button>
              </form>
            );
          })}
        </div>
      )}
      {/* Tarix GET /coin-transactions/history dan — teskari yozuvlar va bekor qilish bilan. */}
      {id && <CoinHistoryList studentId={id} canCancel={!isDeleted} />}
    </TabsContent>
  );
};
