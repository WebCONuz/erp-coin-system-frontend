import { toast } from "sonner";
import { Lock } from "lucide-react";
import { formatDateTime } from "@/ustils";
import { useLockSession } from "@/features/sessions/hooks";
import type { SessionItem } from "@/features/sessions/types";

export const TeacherLockPanel = ({ session }: { session: SessionItem }) => {
  const lockSession = useLockSession(session.id);

  const handleLock = () => {
    if (
      !window.confirm(
        "Darsni qulflashni tasdiqlaysizmi? Qulflangach yo'qlama va ma'lumotlarni tahrirlash uchun qulfni faqat administrator ochishi mumkin bo'ladi.",
      )
    )
      return;

    lockSession.mutate(undefined, {
      onSuccess: () => toast.success("Dars qulflandi"),
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-ink-soft flex items-center gap-1.5">
        {session.isLocked ? (
          <>
            <Lock size={14} />
            Qulflangan
            {session.lockedAt && ` — ${formatDateTime(session.lockedAt)}`}
          </>
        ) : (
          "Dars hali qulflanmagan"
        )}
      </div>

      {!session.isLocked && (
        <button
          type="button"
          onClick={handleLock}
          disabled={lockSession.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
        >
          <Lock size={15} />
          Qulflash
        </button>
      )}
    </div>
  );
};
