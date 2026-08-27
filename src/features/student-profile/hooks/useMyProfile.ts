import { useAuth } from "@/features/auth/hooks/useLogin";
import { useStudentById } from "@/features/students/hooks";

export const useMyProfile = () => {
  const { user } = useAuth();
  const query = useStudentById(user?.id ?? "");

  return { ...query, myId: user?.id ?? "" };
};
