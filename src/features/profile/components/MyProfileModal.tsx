import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoData } from "@/components/partials/no-data";
import { useMyAccount } from "../hooks";
import { EditMyProfileForm } from "./EditMyProfileForm";
import { ChangeMyPasswordForm } from "./ChangeMyPasswordForm";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ProfileTab = "info" | "password";

// Admin panel (admin, super_admin, creator) uchun o'z profilini
// ko'rish/tahrirlash va parolni o'zgartirish modali.
export const MyProfileModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ProfileTab>("info");
  const { data: profile, isLoading, isError } = useMyAccount(open);

  const handleClose = () => {
    setTab("info");
    onClose();
  };

  const initials =
    profile?.fullName
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {t("profile.title")}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : isError || !profile ? (
          <NoData text={t("common.noData")} />
        ) : (
          <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <Avatar className="h-12 w-12 shrink-0">
                {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
                <AvatarFallback className="bg-linear-to-br from-purple-500 to-purple-700 text-white text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{profile.fullName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  @{profile.username}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-600 dark:text-yellow-500 truncate">
                  {profile.tenant?.name && (
                    <>
                      <Building2 size={12} className="shrink-0" />
                      {profile.tenant.name} ·{" "}
                    </>
                  )}
                  {profile.role.displayName}
                </p>
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as ProfileTab)}>
              <TabsList className="w-full">
                <TabsTrigger value="info" className="flex-1">
                  {t("profile.tabs.info")}
                </TabsTrigger>
                <TabsTrigger value="password" className="flex-1">
                  {t("profile.tabs.password")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="pt-3">
                <EditMyProfileForm
                  open={open}
                  profile={profile}
                  onCancel={handleClose}
                  onSuccess={handleClose}
                />
              </TabsContent>

              <TabsContent value="password" className="pt-3">
                <ChangeMyPasswordForm
                  open={open && tab === "password"}
                  userId={profile.id}
                  onCancel={handleClose}
                  onSuccess={handleClose}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
