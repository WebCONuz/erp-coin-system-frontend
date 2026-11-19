import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TENANT_KEY } from "@/features/tenants/constants";
import { tenantSettingsKeys } from "../constants";
import { getTenantSettings, updateTenantSettings } from "../api";
import type { UpdateTenantSettingsDto } from "../types";

/** super_admin/creator — tanlangan tenant (`TENANT_KEY`), qolganlar — o'z tenanti. */
const useSettingsTenantId = () => {
  const { user } = useAuth();
  return localStorage.getItem(TENANT_KEY) ?? user?.tenantId;
};

/** `GET /tenant-settings` — admin, super_admin, teacher (faqat o'qish). Student uchun ochiq emas. */
export const useTenantSettings = (enabled: boolean = true) => {
  const tenantId = useSettingsTenantId();

  return useQuery({
    queryKey: tenantSettingsKeys.settings(tenantId),
    queryFn: getTenantSettings,
    enabled: enabled && !!tenantId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateTenantSettings = () => {
  const queryClient = useQueryClient();
  const tenantId = useSettingsTenantId();

  return useMutation({
    mutationFn: (data: UpdateTenantSettingsDto) => updateTenantSettings(data),
    onSuccess: (res) => {
      queryClient.setQueryData(tenantSettingsKeys.settings(tenantId), res.data);
      queryClient.invalidateQueries({
        queryKey: tenantSettingsKeys.settings(tenantId),
      });
    },
  });
};

/**
 * Teacher uchun coin limiti (bir martada bitta o'quvchiga). Admin va undan
 * yuqori rollarga limit qo'llanmaydi — ular uchun doim `null`.
 */
export const useTeacherCoinLimit = () => {
  const { user } = useAuth();
  const isTeacher = user?.role?.name === ROLES.TEACHER;
  const { data } = useTenantSettings(isTeacher);

  return {
    isTeacher,
    limit: isTeacher ? (data?.teacherCoinLimit ?? null) : null,
  };
};
