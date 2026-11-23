import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/shared/modal";
import { useAuth } from "../hooks/useLogin";

interface Props {
  open: boolean;
  onClose: () => void;
}

/** `POST /auth/logout-all` — barcha qurilmalardagi sessiyalarni yopish tasdig'i. */
export const LogoutAllModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const { logoutAll, isLogoutAllLoading } = useAuth();

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={() => logoutAll()}
      title={t("logoutAll.title")}
      description={t("logoutAll.description")}
      confirmLabel={t("logoutAll.confirm")}
      variant="warning"
      isPending={isLogoutAllLoading}
    />
  );
};
