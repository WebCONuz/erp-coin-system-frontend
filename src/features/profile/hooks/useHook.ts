import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/constants";
import { studentKeys } from "@/features/students/constants";
import { profileKeys } from "../constants";
import { changeMyPassword, getMyProfile, updateMyProfile } from "../api";
import type { ChangeMyPasswordDto, UpdateMyProfileDto } from "../types";

export const useMyAccount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
    enabled,
  });
};

export const useUpdateMyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMyProfileDto) => updateMyProfile(data),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      // Navbar/sidebar'dagi ism va student profil sahifasi ham yangilansin
      queryClient.invalidateQueries({ queryKey: authQueryKeys.getMe() });
      queryClient.invalidateQueries({
        queryKey: studentKeys.oneStudentById(profile.id),
      });
    },
  });
};

export const useChangeMyPassword = (id: string) => {
  return useMutation({
    mutationFn: (data: ChangeMyPasswordDto) => changeMyPassword(id, data),
  });
};
