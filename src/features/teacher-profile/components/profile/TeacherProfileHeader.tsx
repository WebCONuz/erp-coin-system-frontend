import { Mail, Pencil, Phone } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import type { TeacherProfile } from "../../types";

interface Props {
  profile: TeacherProfile;
  onEdit: () => void;
}

export const TeacherProfileHeader = ({ profile, onEdit }: Props) => (
  <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
    <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

    <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-forest-light flex items-center justify-center text-2xl font-display font-bold text-gold ring-2 ring-gold/40 shrink-0">
          {profile.avatarUrl ? (
            <img
              src={getFileUrl(profile.avatarUrl)}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            profile.fullName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold truncate">
            {profile.fullName}
          </h1>
          <p className="text-sm text-paper/60 mt-1">
            {profile.role.displayName}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/60 mt-2">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              {profile.phone}
            </span>
            {profile.email && (
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {profile.email}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gold/15 border border-gold/30 text-gold px-4 py-2.5 text-sm font-medium hover:bg-gold/20 transition-colors"
      >
        <Pencil size={15} />
        Tahrirlash
      </button>
    </div>

    <p className="relative text-xs text-paper/40 mt-4 pt-4 border-t border-white/10 max-w-md">
      Ism-familiya va telefon raqamini faqat administrator o'zgartira oladi.
    </p>
  </div>
);
