import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { t } from "i18next";
import { authQueryKeys } from "../constants";
import { getMe, login, logout } from "../api";
import { clearLocalStoragaData } from "@/services/helpers";
import { ROLES } from "@/assets/constants";
import {
  API_ERROR_CODES,
  canManageRole,
  getApiErrorMessage,
  hasApiErrorCode,
  isTooManyRequestsError,
  type RoleLike,
} from "@/ustils";

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
    onError: (error: unknown) => {
      // Tashkilot to'xtatilgan — backend xabari ko'rsatiladi (oddiy "noto'g'ri parol" emas).
      if (hasApiErrorCode(error, API_ERROR_CODES.TENANT_INACTIVE)) {
        toast.error(getApiErrorMessage(error) || t("apiErrors.TENANT_INACTIVE"));
        return;
      }
      // Username bo'yicha urinishlar limiti (15 daqiqada 10 ta).
      if (isTooManyRequestsError(error)) {
        toast.error(t("apiErrors.TOO_MANY_REQUESTS"));
        return;
      }
      toast.error(getApiErrorMessage(error) || t("invalid_credentials"));
    },
  });

  // logout
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success(t("logout"));
      clearLocalStoragaData();
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  /** Joriy user `target` rolidagi userni boshqara oladimi (`target.level < me.level`). */
  const actorRole = user?.role;
  const canManage = useCallback(
    (target: RoleLike) => canManageRole(actorRole, target),
    [actorRole],
  );

  return {
    user,
    canManage,
    isAuthenticated: !!user,
    isLoading,
    isError,
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    logout: logoutMutation.mutate,
  };
};
