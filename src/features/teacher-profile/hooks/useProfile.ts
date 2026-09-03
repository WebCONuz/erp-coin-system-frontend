import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/constants";
import { getMyTeacherProfile, updateMyTeacherProfile } from "../api";
import { teacherSelfKeys } from "../constants";
import type { UpdateMyProfileDto } from "../types";

export const useTeacherProfile = () => {
  return useQuery({
    queryKey: teacherSelfKeys.profile(),
    queryFn: getMyTeacherProfile,
  });
};

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMyProfileDto) => updateMyTeacherProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherSelfKeys.profile() });
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getMe() });
    },
  });
};
