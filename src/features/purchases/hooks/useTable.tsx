import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CoinAmount } from "@/components/shared/coin";
import { formatDate } from "@/ustils";
import { PurchaseActions } from "../components/PurchaseActions";
import { PurchaseStatusBadge } from "../components/PurchaseStatusBadge";
import { RewardThumb } from "../components/RewardThumb";
import { PurchaseHandledBy } from "../components/PurchaseHandledBy";
import type { Purchase, PurchaseActionStatus } from "../types";

interface Props {
  onAction: (purchase: Purchase, status: PurchaseActionStatus) => void;
}

export const useTable = ({ onAction }: Props) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        accessorKey: "reward",
        header: t("purchases.table.reward"),
        cell: ({ row }) => {
          const { reward } = row.original;
          return (
            <div className="flex min-w-44 items-center gap-3">
              <RewardThumb imageUrl={reward.imageUrl} />
              <span className="font-medium">{reward.title}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "student",
        header: t("purchases.table.student"),
        cell: ({ row }) => (
          <div className="min-w-36">
            <p className="font-medium">{row.original.student?.fullName}</p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {row.original.student?.phone}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "coinSpent",
        header: t("purchases.table.coinSpent"),
        cell: ({ getValue }) => (
          <CoinAmount value={getValue<number>()} variant="pill" size="sm" />
        ),
      },
      {
        accessorKey: "purchasedAt",
        header: t("purchases.table.purchasedAt"),
        cell: ({ getValue }) => (
          <div className="whitespace-nowrap tabular-nums">
            <p>{formatDate(getValue<string>(), "dd.MM.yyyy")}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(getValue<string>(), "HH:mm")}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
        cell: ({ row }) => <PurchaseStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "deliveryNote",
        header: t("purchases.table.note"),
        cell: ({ getValue }) => (
          <p className="line-clamp-3 max-w-56 text-sm whitespace-normal text-muted-foreground">
            {getValue<string | null>() || "—"}
          </p>
        ),
      },
      {
        accessorKey: "approvedBy",
        header: t("purchases.table.handledBy"),
        cell: ({ row }) => <PurchaseHandledBy purchase={row.original} />,
      },
      {
        accessorKey: "actions",
        header: t("purchases.table.actions"),
        cell: ({ row }) => (
          <PurchaseActions purchase={row.original} onAction={onAction} />
        ),
      },
    ],
    [t, onAction],
  );

  return { columns };
};
