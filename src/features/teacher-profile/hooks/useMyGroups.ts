import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { getMyTaughtGroups } from "../api";
import { teacherSelfKeys } from "../constants";

export const useMyTaughtGroups = () => {
  return useQuery({
    queryKey: teacherSelfKeys.myGroups(),
    queryFn: getMyTaughtGroups,
  });
};

/**
 * Teacher guruhga asosiy o'qituvchi sifatida emas, balki sessiya yoki dars
 * jadvali orqali biriktirilganmi. Guruh o'qituvchisi noma'lum bo'lsa — `false`.
 */
export const useIsAssignedGroup = () => {
  const { user } = useAuth();

  return (groupTeacherId?: string | null) =>
    !!groupTeacherId && !!user?.id && groupTeacherId !== user.id;
};
