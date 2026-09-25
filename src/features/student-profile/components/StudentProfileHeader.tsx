import { AtSign, Coins, Pencil, Phone, PhoneCall } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { StudentDetailFull } from "@/features/students/types";

interface Props {
  student: StudentDetailFull;
  onEdit: () => void;
}

export const StudentProfileHeader = ({ student, onEdit }: Props) => {
  const { t } = useTranslation();
  const avatarLetter = student.fullName.charAt(0).toUpperCase();
  const activeGroups =
    student.groupMemberships?.filter((g) => g.isActive) ?? [];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
          <div className="shrink-0">
            {student.avatarUrl ? (
              <img
                // src={getFileUrl(student.avatarUrl)}
                src={student.avatarUrl}
                alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gold/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-forest-light flex items-center justify-center text-2xl font-display font-bold text-gold ring-2 ring-gold/40">
                {avatarLetter}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold truncate">
              {student.fullName}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/60 mt-1.5">
              {student.username && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <AtSign size={13} className="shrink-0" />
                  <span className="truncate">{student.username}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Phone size={13} />
                {student.phone}
              </span>
              {student.parentPhone && (
                <span className="flex items-center gap-1.5">
                  <PhoneCall size={13} />
                  {t("profile.parentLabel")}: {student.parentPhone}
                </span>
              )}
            </div>
            {activeGroups.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {activeGroups.map((g) => (
                  <span
                    key={g.id}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/8 text-paper/80"
                  >
                    {g.group.name} · {g.group.teacher.fullName}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-paper/40 mt-3 max-w-md">
              {t("profile.passwordByAdmin")}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="order-last sm:order-first inline-flex items-center gap-1.5 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-medium text-gold-soft transition-colors hover:bg-gold/20"
          >
            <Pencil size={13} />
            {t("profile.editButton")}
          </button>
          <div className="text-left sm:text-right">
            <p className="text-xs text-paper/50">
              {t("garden.hero.balance")}
            </p>
            <p className="font-display text-3xl font-bold text-gold flex items-center gap-1.5 sm:justify-end">
              <Coins size={22} />
              {student.wallet?.balance ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
