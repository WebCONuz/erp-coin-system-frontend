import { Info, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoData } from "@/components/partials/no-data";
import { useMyAccount } from "../hooks";
import { EditMyProfileForm } from "./EditMyProfileForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

// Student kabineti uchun: o'z ma'lumotlarini tahrirlash (parolsiz —
// parolni faqat administrator o'zgartiradi).
export const EditMyProfileModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const { data: profile, isLoading, isError } = useMyAccount(open);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-ink">
            {t("profile.editTitle")}
          </DialogTitle>
          <DialogDescription className="flex items-start gap-1.5 text-ink-soft">
            <Info size={14} className="mt-0.5 shrink-0" />
            {t("profile.passwordByAdmin")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-ink-soft" />
          </div>
        ) : isError || !profile ? (
          <NoData text={t("common.noData")} />
        ) : (
          <EditMyProfileForm
            open={open}
            profile={profile}
            showParentPhone
            onCancel={onClose}
            onSuccess={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
