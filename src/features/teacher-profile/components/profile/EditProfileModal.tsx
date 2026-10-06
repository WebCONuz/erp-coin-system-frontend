import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateTeacherProfile } from "../../hooks";
import type { TeacherProfile } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: TeacherProfile;
}

export const EditProfileModal = ({ open, onClose, profile }: Props) => {
  const { t } = useTranslation();
  const updateProfile = useUpdateTeacherProfile();
  const [email, setEmail] = useState(profile.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");

  useEffect(() => {
    if (open) {
      setEmail(profile.email ?? "");
      setAvatarUrl(profile.avatarUrl ?? "");
    }
  }, [open, profile]);

  const handleSubmit = () => {
    const payload: { email?: string; avatarUrl?: string } = {};
    if (email !== (profile.email ?? "")) payload.email = email;
    if (avatarUrl !== (profile.avatarUrl ?? "")) payload.avatarUrl = avatarUrl;

    if (!Object.keys(payload).length) {
      onClose();
      return;
    }

    updateProfile.mutate(payload, {
      onSuccess: () => {
        toast.success(t("profile.updated"));
        onClose();
      },
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">
            {t("profile.editTitle")}
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            {t("teacherProfile.profile.editDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              {t("profile.form.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              {t("profile.form.avatarUrl")}
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-gold/50"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors disabled:opacity-60"
          >
            {updateProfile.isPending ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
