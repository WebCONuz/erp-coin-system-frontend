import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { t } from "i18next";
import { authQueryKeys } from "../constants";
import { getMe, login, logout } from "../api";
import { clearLocalStoragaData } from "@/services/helpers";
import { ROLES } from "@/assets/constants";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("is_authenticated");

  // get-me
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: authQueryKeys.getMe(),
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 15, // Ma'lumot 15 daqiqa "fresh"
    enabled: !!isAuthenticated,
  });

  // login
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      localStorage.setItem("is_authenticated", "true");
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.getMe() });
      toast.success(t("welcome_back"));
      const roleName = data?.user?.role;
      navigate(
        roleName === ROLES.STUDENT
          ? "/student"
          : roleName === ROLES.TEACHER
            ? "/teacher"
            : "/admin",
      );
    },
    onError: (error: any) => {
      toast.error(error?.data?.message || t("invalid_credentials"));
    },
  });

  // logout
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearLocalStoragaData();
      queryClient.removeQueries({ queryKey: authQueryKeys.getMe() }); // Keshni butunlay o'chirish
      navigate("/login");
      toast.success(t("logout"));
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    logout: logoutMutation.mutate,
  };
};
