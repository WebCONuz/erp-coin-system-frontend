import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Coins, Gift } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { PurchaseActions } from "../components/PurchaseActions";
import { PurchaseStatusBadge } from "../components/PurchaseStatusBadge";
import type { Purchase, PurchaseActionStatus } from "../types";

interface Props {
  onAction: (purchase: Purchase, status: PurchaseActionStatus) => void;
}

export const useTable = ({ onAction }: Props) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        accessorKey: "id",
        header: "№",
        cell: ({ row }) => ((currentPage - 1) * 10 + row.index + 1).toString(),
      },
      {
        accessorKey: "reward",
        header: t("purchases.table.reward"),
        cell: ({ row }) => {
          const { reward } = row.original;
          return (
            <div className="flex min-w-44 items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-pink-100 dark:bg-pink-900/40">
                {reward.imageUrl ? (
                  <img
                    src={getFileUrl(reward.imageUrl)}
                    alt={reward.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Gift
                    size={16}
                    className="text-pink-600 dark:text-pink-400"
                  />
                )}
              </div>
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
            <p className="text-xs text-muted-foreground">
              {row.original.student?.phone}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "coinSpent",
        header: t("purchases.table.coinSpent"),
        cell: ({ getValue }) => (
          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
            <Coins size={14} />
            {getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: "purchasedAt",
        header: t("purchases.table.purchasedAt"),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap">
            {formatDate(getValue<string>(), "dd.MM.yyyy, HH:mm")}
          </span>
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
          <p className="max-w-56 text-xs text-muted-foreground line-clamp-3">
            {getValue<string | null>() || "—"}
          </p>
        ),
      },
      {
        accessorKey: "approvedBy",
        header: t("purchases.table.handledBy"),
        cell: ({ row }) => {
          const { approvedBy, deliveredBy, deliveredAt } = row.original;
          if (!approvedBy && !deliveredBy) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <div className="min-w-40 space-y-0.5 text-xs text-muted-foreground">
              {approvedBy && (
                <p>
                  {t("purchases.table.approvedBy")}:{" "}
                  <span className="text-foreground">{approvedBy.fullName}</span>
                </p>
              )}
              {deliveredBy && (
                <p>
                  {t("purchases.table.deliveredBy")}:{" "}
                  <span className="text-foreground">
                    {deliveredBy.fullName}
                  </span>
                </p>
              )}
              {deliveredAt && (
                <p>{formatDate(deliveredAt, "dd.MM.yyyy, HH:mm")}</p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("purchases.table.actions"),
        cell: ({ row }) => (
          <PurchaseActions purchase={row.original} onAction={onAction} />
        ),
      },
    ],
    [t, currentPage, onAction],
  );

  return { columns };
};
