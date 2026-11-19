import { toast } from "sonner";
import { formatScheduleConflict } from "@/ustils";
import type { SessionSync, SessionSyncConflict } from "../types";

type TFn = (key: string, options?: Record<string, unknown>) => string;

/** To'qnashuvlar ro'yxati — toast tavsifi uchun (ko'pi bilan 5 ta qator). */
export const formatSyncConflicts = (
  conflicts: SessionSyncConflict[],
  t: TFn,
  max = 5,
) => {
  const lines = conflicts.slice(0, max).map((c) => formatScheduleConflict(c, t));
  if (conflicts.length > max) {
    lines.push(t("plans.sync.andMore", { count: conflicts.length - max }));
  }
  return lines.join("\n");
};

export const notifySyncConflicts = (
  conflicts: SessionSyncConflict[] | undefined,
  t: TFn,
) => {
  if (!conflicts?.length) return;
  toast.warning(t("plans.sync.conflictsTitle", { count: conflicts.length }), {
    description: formatSyncConflicts(conflicts, t),
    duration: 12000,
    className: "whitespace-pre-line",
  });
};

/**
 * Shablon/istisno/dam olish kuni o'zgargach backend qaytargan `sessionSync`
 * hisobotini ko'rsatadi: nechta dars yangilandi/o'chirildi/yaratildi va
 * qaysilari to'qnashuv tufayli ko'chirilmadi.
 */
export const notifySessionSync = (sync: SessionSync | undefined, t: TFn) => {
  if (!sync) return;
  const { updated, removed, created, conflicts } = sync;

  if (updated || removed || created) {
    toast.info(t("plans.sync.summary", { updated, removed, created }));
  }
  notifySyncConflicts(conflicts, t);
};
