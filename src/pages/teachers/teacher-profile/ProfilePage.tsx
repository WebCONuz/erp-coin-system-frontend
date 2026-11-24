import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/states";
import { useTeacherProfile } from "@/features/teacher-profile/hooks";
import {
  TeacherProfileHeader,
  EditProfileModal,
} from "@/features/teacher-profile/components/profile";
import { TeacherGroupsPreview } from "@/features/teacher-profile/components/dashboard";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading, isError } = useTeacherProfile();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }
  if (isError || !profile) {
    return (
      <div className="rounded-2xl border bg-card">
        <EmptyState icon={UserX} title={t("teacherProfile.profile.notFound")} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <TeacherProfileHeader profile={profile} onEdit={() => setEditOpen(true)} />

      <TeacherGroupsPreview groups={profile.taughtGroups} />

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
      />
    </div>
  );
};

export default ProfilePage;
