import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { t } from "i18next";
import { authQueryKeys } from "../constants";
import { getMe, login, logout } from "../api";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
  });

  // login
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.getMe() });
      localStorage.setItem("is_authenticated", "true");
      toast.success(t("welcome_back"));
      navigate("/admin");
    },
    onError: (error: any) => {
      toast.error(error?.data?.message || t("invalid_credentials"));
    },
  });

  // logout
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("is_authenticated");
      queryClient.setQueryData(authQueryKeys.getMe(), null); // Keshni tozalash
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
