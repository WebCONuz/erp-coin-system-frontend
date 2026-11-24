import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ArrowUpDown, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/shared/avatar";
import { CoinAmount } from "@/components/shared/coin";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import type { GroupDetail, GroupStudent } from "../../types";
import { useRemoveStudent } from "../../hooks";

interface StudentTableProps {
  group: GroupDetail;
  search?: string;
}

type SortKey = "name" | "joinedAt" | "coin";
type SortDir = "asc" | "desc";

export const StudentTable = ({ group, search = "" }: StudentTableProps) => {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const removeStudent = useRemoveStudent(group.id);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const query = search.trim().toLowerCase();

  const sorted = [...group.students]
    .filter(
      (gs) =>
        !query ||
        gs.student.fullName.toLowerCase().includes(query) ||
        (gs.student.phone ?? "").includes(query),
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.student.fullName.localeCompare(b.student.fullName);
      } else if (sortKey === "coin") {
        cmp =
          (a.student.wallet?.balance ?? 0) - (b.student.wallet?.balance ?? 0);
      } else {
        cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleRemove = (studentId: string) => {
    removeStudent.mutate(studentId, {
      onSuccess: () => setOpenPopoverId(null),
    });
  };

  const sortProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-[13px] text-muted-foreground">
            <tr>
              <SortHeader
                {...sortProps}
                col="name"
                label={t("groups.table.name")}
              />
              <th
                scope="col"
                className="hidden px-4 py-2.5 text-left font-medium md:table-cell"
              >
                {t("common.phone")}
              </th>
              <SortHeader
                {...sortProps}
                col="coin"
                label={t("groups.table.coin")}
                className="hidden sm:table-cell"
              />
              <SortHeader
                {...sortProps}
                col="joinedAt"
                label={t("groups.table.joinedAt")}
                className="hidden lg:table-cell"
              />
              <th scope="col" className="w-12 px-2">
                <span className="sr-only">{t("common.actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {query
                    ? t("groups.addStudent.noResultsFor", { search })
                    : t("groups.table.empty")}
                </td>
              </tr>
            ) : (
              sorted.map((gs) => (
                <StudentRow
                  key={gs.id}
                  groupStudent={gs}
                  isOpen={openPopoverId === gs.student.id}
                  onOpenChange={(open) =>
                    setOpenPopoverId(open ? gs.student.id : null)
                  }
                  onRemove={() => handleRemove(gs.student.id)}
                  isRemoving={removeStudent.isPending}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** Saralanadigan ustun sarlavhasi (`aria-sort` bilan). */
const SortHeader = ({
  col,
  label,
  className,
  sortKey,
  sortDir,
  onSort,
}: {
  col: SortKey;
  label: string;
  className?: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) => {
  const active = sortKey === col;
  return (
    <th
      scope="col"
      aria-sort={
        active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn("px-4 py-2.5 text-left font-medium", className)}
    >
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn(
          "-mx-1 inline-flex items-center gap-1 rounded px-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
          active && "text-foreground",
        )}
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ArrowUp className="size-3.5 text-primary" aria-hidden />
          ) : (
            <ArrowDown className="size-3.5 text-primary" aria-hidden />
          )
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" aria-hidden />
        )}
      </button>
    </th>
  );
};

// --- Alohida Row komponenti (Popover state izolyatsiyasi uchun) ---

interface StudentRowProps {
  groupStudent: GroupStudent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: () => void;
  isRemoving: boolean;
}

const StudentRow = ({
  groupStudent,
  isOpen,
  onOpenChange,
  onRemove,
  isRemoving,
}: StudentRowProps) => {
  const { student, joinedAt } = groupStudent;
  const { t } = useTranslation();
  const balance = student.wallet?.balance ?? 0;

  return (
    <tr className="border-t transition-colors hover:bg-muted/40">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={student.fullName} />
          <div className="min-w-0">
            <Link
              to={`/admin/students/${student.id}`}
              className="block truncate font-medium hover:text-primary hover:underline focus-visible:underline"
            >
              {student.fullName}
            </Link>
            {/* Kichik ekranlarda yashirin ustunlar ma'lumoti shu yerda */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground md:hidden">
              {student.phone && (
                <span className="tabular-nums">{student.phone}</span>
              )}
              <CoinAmount value={balance} size="sm" className="sm:hidden" />
            </div>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 tabular-nums text-muted-foreground md:table-cell">
        {student.phone ?? "—"}
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <CoinAmount value={balance} variant="pill" size="sm" />
      </td>
      <td className="hidden px-4 py-3 tabular-nums text-muted-foreground lg:table-cell">
        {formatDate(joinedAt, "dd.MM.yyyy")}
      </td>
      <td className="px-2 py-3 text-right">
        <Popover open={isOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
              aria-label={`${t("groups.table.removeTitle")}: ${student.fullName}`}
            >
              <UserMinus className="size-4" aria-hidden />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-4">
            <div className="mb-3 flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive-soft text-destructive">
                <UserMinus className="size-4" aria-hidden />
              </span>
              <div className="text-sm">
                <p className="font-medium">{t("groups.table.removeTitle")}</p>
                <p className="mt-0.5 text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {student.fullName}
                  </span>{" "}
                  {t("groups.table.removeConfirmSuffix")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isRemoving}
                className="flex-1"
              >
                {t("common.no")}
              </Button>
              <Button
                size="sm"
                onClick={onRemove}
                disabled={isRemoving}
                className="flex-1 bg-destructive text-white hover:bg-destructive/90 dark:text-background"
              >
                {isRemoving
                  ? t("common.deleting")
                  : t("groups.table.removeConfirmBtn")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  );
};
