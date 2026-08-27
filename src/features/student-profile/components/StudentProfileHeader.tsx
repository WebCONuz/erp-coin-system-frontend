import { useRef } from "react";
import { toast } from "sonner";
import { Camera, Coins, KeyRound, Pencil, Phone, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/utils";
import { useUploadStudentAvatar } from "@/features/students/hooks";
import type { StudentDetailFull } from "@/features/students/types";

interface Props {
  student: StudentDetailFull;
  onEdit: () => void;
  onChangePassword: () => void;
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const StudentProfileHeader = ({
  student,
  onEdit,
  onChangePassword,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadStudentAvatar(student.id);

  const avatarLetter = student.fullName.charAt(0).toUpperCase();
  const activeGroups = student.groupMemberships?.filter((g) => g.isActive) ?? [];
  const primaryGroup = activeGroups[0];

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.error("Faqat JPEG, PNG, WebP yoki GIF formatidagi rasm yuklang");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Rasm hajmi 2MB dan oshmasligi kerak");
      return;
    }

    uploadAvatar.mutate(file, {
      onSuccess: () => toast.success("Avatar yangilandi"),
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={uploadAvatar.isPending}
          className="relative block w-16 h-16 rounded-xl overflow-hidden shadow-md group"
        >
          {student.avatarUrl ? (
            <img
              src={getFileUrl(student.avatarUrl)}
              alt="avatar"
              className="w-16 h-16 object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white">
              {avatarLetter}
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={18} className="text-white" />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {student.fullName}
          </h1>
          {!student.isActive && (
            <Badge className="border-0 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
              Arxivlangan
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {student.phone}
          </span>
          {student.parentPhone && (
            <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
              <PhoneCall size={13} />
              Ota-ona: {student.parentPhone}
            </span>
          )}
          {primaryGroup && (
            <span>
              {primaryGroup.group.name} guruhi · {primaryGroup.group.teacher.fullName}
              {activeGroups.length > 1 && ` +${activeGroups.length - 1}`}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
            <Coins size={13} />
            {student.wallet?.balance ?? 0} coin
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="gap-2" onClick={onChangePassword}>
          <KeyRound size={14} />
          Parol
        </Button>
        <Button
          size="sm"
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          onClick={onEdit}
        >
          <Pencil size={14} />
          Tahrirlash
        </Button>
      </div>
    </header>
  );
};
