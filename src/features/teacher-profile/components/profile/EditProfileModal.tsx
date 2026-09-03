import { useEffect, useState } from "react";
import { toast } from "sonner";
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
        toast.success("Profil yangilandi");
        onClose();
      },
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">
            Profilni tahrirlash
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            Faqat email va profil rasmini o'zgartirishingiz mumkin
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-ink-soft mb-1.5 block">
              Email
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
              Profil rasmi (URL)
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
            {updateProfile.isPending ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
