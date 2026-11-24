import { Info, Mail, Pencil, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/avatar";
import type { TeacherProfile } from "../../types";

interface Props {
  profile: TeacherProfile;
  onEdit: () => void;
}

/** O'qituvchining o'z profili sarlavhasi. */
export const TeacherProfileHeader = ({ profile, onEdit }: Props) => {
  const { t } = useTranslation();

  return (
    <header className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <UserAvatar
            name={profile.fullName}
            url={profile.avatarUrl}
            className="size-14 rounded-2xl text-lg sm:size-16"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-heading text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {profile.fullName}
              </h1>
              <Badge variant="soft">{profile.role.displayName}</Badge>
            </div>
            <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <dt>
                  <Phone className="size-3.5" aria-hidden />
                  <span className="sr-only">{t("common.phone")}</span>
                </dt>
                <dd className="tabular-nums">{profile.phone}</dd>
              </div>
              {profile.email && (
                <div className="flex min-w-0 items-center gap-1.5">
                  <dt>
                    <Mail className="size-3.5" aria-hidden />
                    <span className="sr-only">{t("common.email")}</span>
                  </dt>
                  <dd className="truncate">{profile.email}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <Button onClick={onEdit} className="h-9 shrink-0 gap-2">
          <Pencil className="size-4" aria-hidden />
          {t("profile.editButton")}
        </Button>
      </div>

      <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
        <Info className="mt-px size-3.5 shrink-0" aria-hidden />
        {t("teacherProfile.profile.adminOnlyHint")}
      </p>
    </header>
  );
};
