import type { ConfirmAction, StudentDetailFull } from "../types";

export const StudentActions = (student: StudentDetailFull | undefined) => {
  const confirmContent: Record<
    NonNullable<ConfirmAction>,
    {
      title: string;
      description: string;
      label: string;
      variant: "danger" | "warning";
    }
  > = {
    archive: {
      title: "Talabani arxivlash",
      description: `"${student?.fullName}" ni arxivlaysizmi? Bu talabaning faoliyati to'xtatiladi, lekin ma'lumotlari saqlanib qoladi. Keyinchalik qayta faollashtirishingiz mumkin.`,
      label: "Ha, arxivlash",
      variant: "warning",
    },
    restore: {
      title: "Talabani faollashtirish",
      description: `"${student?.fullName}" ni qayta faollashtirasizmi? Talaba tizimga kirish huquqini qaytarib oladi.`,
      label: "Ha, faollashtirish",
      variant: "warning",
    },
    delete: {
      title: "Talabani o'chirish",
      description: `"${student?.fullName}" ni o'chirmoqchimisiz? Bu amal talabani tizimdan butunlay olib tashlaydi (soft delete). Qayta tiklash faqat administrator tomonidan amalga oshirilishi mumkin.`,
      label: "Ha, o'chirish",
      variant: "danger",
    },
  };

  return { confirmContent };
};

export const StudentStatusBadge = (isActive: boolean, isDeleted: boolean) => {
  return isDeleted
    ? {
        label: "O'chirilgan",
        cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
      }
    : isActive
      ? {
          label: "Faol",
          cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        }
      : {
          label: "Arxivlangan",
          cls: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        };
};

export const STUDENT_TAB_OPTIONS = [
  { value: "info", label: "Ma'lumotlar" },
  { value: "groups", label: "Guruhlar" },
  { value: "coins", label: "Tangalar" },
  { value: "gifts", label: "Sovg'alar" },
  { value: "security", label: "Xavfsizlik" },
];
