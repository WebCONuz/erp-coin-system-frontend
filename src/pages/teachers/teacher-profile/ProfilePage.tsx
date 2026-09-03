import { useState } from "react";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { useTeacherProfile } from "@/features/teacher-profile/hooks";
import {
  TeacherProfileHeader,
  EditProfileModal,
} from "@/features/teacher-profile/components/profile";
import { TeacherGroupsPreview } from "@/features/teacher-profile/components/dashboard";

const ProfilePage = () => {
  const { data: profile, isLoading, isError } = useTeacherProfile();
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <PageLoading />;
  if (isError || !profile) {
    return <NoData text="Profil ma'lumotlari topilmadi" />;
  }

  return (
    <div className="space-y-4">
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
