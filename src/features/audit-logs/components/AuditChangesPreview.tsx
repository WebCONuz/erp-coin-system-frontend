import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/ustils";
import type { AuditLog } from "../types";
import { getAuditEntityLabel } from "../constants";
import { AuditActionBadge } from "./AuditActionBadge";

const PREVIEW_FIELDS = 3;

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

interface Props {
  log: AuditLog;
}

/** `changes` ning qisqa ko'rinishi + to'liq JSON uchun "Batafsil" oynasi. */
export const AuditChangesPreview = ({ log }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const entries = Object.entries(log.changes ?? {});

  if (!entries.length && !log.description) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const fieldLabel = (key: string) =>
    t(`auditLogs.field.${key}`, { defaultValue: key });

  return (
    <div className="min-w-48 max-w-72 space-y-0.5 text-xs">
      {log.description && (
        <p className="text-foreground line-clamp-2">{log.description}</p>
      )}
      {entries.slice(0, PREVIEW_FIELDS).map(([key, value]) => (
        <p key={key} className="truncate text-muted-foreground">
          <span className="text-foreground/80">{fieldLabel(key)}:</span>{" "}
          {formatValue(value)}
        </p>
      ))}
      {entries.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-medium text-purple-600 hover:underline dark:text-purple-400"
        >
          {t("auditLogs.details")}
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <AuditActionBadge action={log.actionType} />
              <span className="text-base">
                {getAuditEntityLabel(t, log.entityType)}
              </span>
            </DialogTitle>
          </DialogHeader>

          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-muted-foreground">{t("auditLogs.table.date")}</dt>
            <dd className="min-w-0">
              {formatDate(log.createdAt, "dd.MM.yyyy, HH:mm:ss")}
            </dd>
            <dt className="text-muted-foreground">{t("auditLogs.table.user")}</dt>
            <dd className="min-w-0 truncate">
              {log.createdByUser?.fullName ?? "—"}
            </dd>
            <dt className="text-muted-foreground">
              {t("auditLogs.table.entityId")}
            </dt>
            <dd className="min-w-0 break-all font-mono text-xs leading-5">
              {log.entityId}
            </dd>
          </dl>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t("auditLogs.table.changes")}
            </p>
            <pre className="max-h-80 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              {JSON.stringify(log.changes, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
