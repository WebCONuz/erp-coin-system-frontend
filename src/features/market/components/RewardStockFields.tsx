import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isUnlimitedStock } from "../lib/stock";
import type { RewardFormValues } from "../schema";
import type { Reward } from "../types";
import { RewardInventory } from "./RewardInventory";

interface Props {
  form: UseFormReturn<RewardFormValues>;
  // Tahrirlashda — joriy sovg'a; yaratishda undefined.
  reward?: Reward;
}

// Yaratishda: "Cheksiz" toggle + son. Tahrirlashda ikki rejim:
// "delta" (asosiy, `stockDelta`) va "exact" (kamdan-kam, `stock` ustiga yoziladi).
export const RewardStockFields = ({ form, reward }: Props) => {
  const { t } = useTranslation();
  const isEdit = !!reward;
  const isCurrentlyUnlimited = !!reward && isUnlimitedStock(reward);

  const stockMode = form.watch("stockMode");
  const isUnlimited = form.watch("isUnlimited");
  const stockDelta = form.watch("stockDelta");

  const showDeltaMode = isEdit && !isCurrentlyUnlimited;
  const showExactFields = !isEdit || stockMode === "exact";

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {t("market.rewardForm.stockLabel")}
        </p>
        {reward && <RewardInventory reward={reward} />}
      </div>

      {showDeltaMode && (
        <Tabs
          value={stockMode}
          onValueChange={(value) =>
            form.setValue("stockMode", value as RewardFormValues["stockMode"])
          }
        >
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-lg bg-muted/50 p-1">
            <TabsTrigger value="delta" className="text-xs sm:text-sm">
              {t("market.rewardForm.stockMode.delta")}
            </TabsTrigger>
            <TabsTrigger value="exact" className="text-xs sm:text-sm">
              {t("market.rewardForm.stockMode.exact")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {showDeltaMode && stockMode === "delta" && reward && (
        <FormField
          control={form.control}
          name="stockDelta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("market.rewardForm.deltaLabel")}</FormLabel>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => field.onChange((field.value || 0) - 1)}
                >
                  <Minus />
                </Button>
                <FormControl>
                  <Input
                    type="number"
                    className="text-center"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => field.onChange((field.value || 0) + 1)}
                >
                  <Plus />
                </Button>
              </div>
              {stockDelta !== 0 && (
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t("market.rewardForm.deltaPreview", {
                    from: reward.stock,
                    to: reward.stock + stockDelta,
                  })}
                </p>
              )}
              <FormDescription className="text-xs">
                {t("market.rewardForm.deltaHint")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showExactFields && (
        <>
          <FormField
            control={form.control}
            name="isUnlimited"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2.5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    className="mt-0.5"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="cursor-pointer font-medium">
                    {t("market.rewardForm.unlimitedLabel")}
                  </FormLabel>
                  <FormDescription className="text-xs">
                    {t("market.rewardForm.unlimitedHint")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("market.rewardForm.onSaleLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    disabled={isUnlimited}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEdit && !isUnlimited && (
            <p className="flex gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>
                {t("market.rewardForm.exactWarning", {
                  count: reward?.reservedCount ?? 0,
                })}
              </span>
            </p>
          )}
        </>
      )}
    </div>
  );
};
